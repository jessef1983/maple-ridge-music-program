#!/usr/bin/env node
/**
 * generate-tags.js
 * Regenerates mpr-tags.html from project-files/inventory.md
 * Usage: node generate-tags.js   (run from mpr-project/)
 *
 * Local dev tool only — not part of the Claude Enterprise upload.
 * Run this locally, then the regenerated project-files/mpr-tags.html
 * goes into the upload folder alongside it.
 */

const fs = require('fs');
const path = require('path');

const INVENTORY_PATH = path.join(__dirname, 'project-files/inventory.md');
const TAG_LOG_PATH = path.join(__dirname, 'project-files/tag-log.md');
const ASSIGNMENT_PATH = path.join(__dirname, 'project-files/assignment.md');
const TAGS_TEMPLATE_PATH = path.join(__dirname, 'tags-template.html');
const OUTPUT_PATH = path.join(__dirname, 'project-files/mpr-tags.html');

// Instrument family mapping — must cover every distinct value in inventory.md's
// Instrument column, or a real instrument silently gets mislabeled by the fallback.
// Check `awk -F'|' '...' inventory.md | sort -u` against this map whenever a new
// instrument type is added to the fleet.
const FAMILY_MAP = {
  'Trumpet': 'tpt',
  'Piccolo Trumpet': 'pct',
  'French Horn': 'hrn',
  'Euphonium': 'eup',
  'Flute': 'fl',
  'Percussion': 'prc',
  'Tuba': 'tub',
  'Trombone': 'trb',
  'Bassoon': 'bsn',
  'Clarinet': 'clr',
  'Alto Sax': 'asx',
  'Tenor Sax': 'tsx',
  // Oboe + English horn share one tag color/label (double-reed family). Bassoon stays its own.
  'Oboe': 'dbl',
  'English Horn': 'dbl',
  'Alto Horn (F)': 'ahn',
  'Descant Horn (F)': 'dsc',
  'Mellophone': 'mel',
  'Flugelhorn': 'flg',
  'Cornet': 'crt',
  'Strings': 'str',
};

/**
 * Parse inventory markdown and extract instrument data
 */
function parseInventory(content) {
  const fleet = [];

  // Find the instruments table
  const lines = content.split('\n');
  let inTable = false;
  let headerIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find table start
    if (line.includes('| MPR | Instrument |')) {
      inTable = true;
      headerIndex = i;
      continue; // the separator line and any non-MPR row are filtered out below, no manual skip needed
    }

    if (!inTable) continue;

    // End of table (blank line or new section)
    if (!line.startsWith('|') || line.trim() === '') {
      break;
    }

    // Parse table row
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length < 8) continue; // Skip incomplete rows

    const [mpr, instrument, model, holder, serial, landed, status, condition] = cells;

    if (!mpr.startsWith('MPR-')) continue;

    // Determine family from instrument type
    const fam = FAMILY_MAP[instrument];
    if (!fam) {
      console.warn(`⚠ Unmapped instrument type "${instrument}" (${mpr}) — add it to FAMILY_MAP in generate-tags.js, defaulting to "oth" (Other) for now`);
    }
    const serialText = serial.replace(/[✅📷⚠️]/g, '').trim();
    const hasSerial = /\d/.test(serialText);
    const serialOk = serial.includes('✅') ? true : serial.includes('📷') ? false : null;

    fleet.push({
      id: mpr,
      fam: fam || 'oth',
      model: model,
      serial: hasSerial ? serialText : '',
      serialOk: serialOk,
      location: holder === '—' ? '' : holder, // inventory.md's "Location" column — a status (Assigned/Storage/etc.), NOT a student name
    });
  }

  return fleet;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse tag-log.md into { mprId: { permanent: 'YYYY-MM-DD'|undefined, student: 'YYYY-MM-DD'|undefined } }
 * Uses only the LATEST row per MPR ID + Tag Type (later rows in the file win on tie/parse issues).
 */
function parseTagLog(content) {
  const log = {};
  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.includes('| MPR ID | Tag Type |')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) break;

    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length < 3) continue;

    const [mpr, tagType, datePrinted] = cells;
    if (!mpr.startsWith('MPR-')) continue; // separator row or malformed row

    const key = tagType.trim().toLowerCase();
    if (key !== 'permanent' && key !== 'student') continue;
    // A Pending/TBD row documents an outstanding print, not a completed tag event.
    // Only actual print dates can clear a tag requirement.
    if (!ISO_DATE.test(datePrinted)) continue;

    if (!log[mpr]) log[mpr] = {};
    const existing = log[mpr][key];
    // >= so that on a same-day reprint (e.g. reassigned to a new holder the same day),
    // the row appended LATER in the file wins — tag-log.md's convention is newest-last.
    if (!existing || datePrinted >= existing) {
      log[mpr][key] = datePrinted;
    }
  }

  return log;
}

/**
 * Parse assignment.md's "Active assignments" table into
 * { mprId: { student: 'Full Name', dateOut: 'Date Out' (raw string) } }
 */
function parseActiveAssignments(content) {
  const assignments = {};
  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.includes('| Assignment | MPR |')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) break;

    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length < 5) continue;

    const [, mpr, , student, dateOut] = cells;
    if (!mpr || !mpr.startsWith('MPR-')) continue;

    // Drop a trailing role annotation like "(Instructor)" / "(Assistant Director)" for tag display
    const displayName = (student || '').replace(/\s*\([^)]*\)\s*$/, '').trim();

    assignments[mpr] = { student: displayName, dateOut };
  }

  return assignments;
}

/**
 * Decide the correct holder to print/display, and whether each fleet item needs
 * a tag printed and why.
 *
 * Holder: the student's name from assignment.md's active table — NOT inventory.md's
 * "Location" column (that's a status like Assigned/Storage/Band Room, never a name;
 * conflating the two used to print "Assigned" as a student's name on the tag).
 * Falls back to the Location status when there's no active assignment (Storage, Band
 * Room, Unassigned) — and flags the rare case where Location says "Assigned" but
 * assignment.md has no matching active row, since that's a real data inconsistency,
 * not something to silently print as if it were a name.
 *
 * needsTag: permanent tag never logged, OR an active assignment whose student tag
 * was never logged or was printed before the assignment's Date Out (stale).
 */
function applyTagStatus(fleet, tagLog, activeAssignments) {
  for (const item of fleet) {
    const log = tagLog[item.id] || {};
    const assignment = activeAssignments[item.id];
    const reasons = [];

    if (assignment) {
      item.holder = assignment.student;
    } else if (item.location && item.location.toLowerCase() === 'assigned') {
      item.holder = '⚠️ Assigned but no assignment.md record';
    } else {
      item.holder = item.location;
    }

    if (!log.permanent) {
      reasons.push('permanent tag not logged');
    }

    if (assignment) {
      const dateOut = assignment.dateOut;
      if (!log.student) {
        reasons.push('active assignment, student tag not logged');
      } else if (ISO_DATE.test(dateOut) && ISO_DATE.test(log.student) && log.student < dateOut) {
        reasons.push(`student tag predates assignment (tagged ${log.student}, assigned ${dateOut})`);
      }
    }

    item.needsTag = reasons.length > 0;
    item.needsTagReason = reasons.join('; ');
  }
}

/**
 * Generate JavaScript code for FLEET array
 */
function generateFleetCode(fleet) {
  const lines = fleet.map(item => {
    const serialOkStr = item.serialOk === true ? 'true' : item.serialOk === false ? 'false' : 'null';
    const reason = item.needsTagReason.replace(/"/g, '\\"');
    return `  {id:"${item.id}", fam:"${item.fam}", model:"${item.model}", serial:"${item.serial}", serialOk:${serialOkStr}, holder:"${item.holder}", needsTag:${item.needsTag ? 'true' : 'false'}, needsTagReason:"${reason}"},`;
  });

  return 'const FLEET = [\n' + lines.join('\n') + '\n];';
}

/**
 * Read template and replace FLEET array
 */
function generateHTML(fleet) {
  let templateContent = fs.readFileSync(TAGS_TEMPLATE_PATH, 'utf-8');
  const fleetCode = generateFleetCode(fleet);

  // Replace the FLEET array in template
  templateContent = templateContent.replace(
    /const FLEET = \[[\s\S]*?\];/,
    fleetCode
  );

  return templateContent;
}

/**
 * Main
 */
function main() {
  try {
    const inventoryContent = fs.readFileSync(INVENTORY_PATH, 'utf-8');
    const tagLogContent = fs.readFileSync(TAG_LOG_PATH, 'utf-8');
    const assignmentContent = fs.readFileSync(ASSIGNMENT_PATH, 'utf-8');

    const fleet = parseInventory(inventoryContent);
    const tagLog = parseTagLog(tagLogContent);
    const activeAssignments = parseActiveAssignments(assignmentContent);
    applyTagStatus(fleet, tagLog, activeAssignments);

    const htmlContent = generateHTML(fleet);
    fs.writeFileSync(OUTPUT_PATH, htmlContent, 'utf-8');

    const needingTags = fleet.filter(f => f.needsTag).length;
    console.log(`✓ Generated ${OUTPUT_PATH}`);
    console.log(`  ${fleet.length} instruments in fleet`);
    console.log(`  ${needingTags} flagged as needing a tag (see tag-log.md)`);

  } catch (error) {
    console.error('✗ Error generating tags:', error.message);
    process.exit(1);
  }
}

main();
