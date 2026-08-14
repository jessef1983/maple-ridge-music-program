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

// Instrument family mapping
const FAMILY_MAP = {
  'Trumpet': 'tpt',
  'Flute': 'fl',
  'Euphonium': 'eup',
  'French Horn': 'hrn',
  'Percussion': 'prc',
  'Strings': 'str',
};

const FAMILY_NAMES = {
  'tpt': 'Trumpet',
  'fl': 'Flute',
  'eup': 'Euphonium',
  'hrn': 'Horn',
  'prc': 'Percussion',
  'str': 'Strings',
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
    const fam = FAMILY_MAP[instrument] || 'str';
    const serialText = serial.replace(/[✅📷⚠️]/g, '').trim();
    const hasSerial = /\d/.test(serialText);
    const serialOk = serial.includes('✅') ? true : serial.includes('📷') ? false : null;

    fleet.push({
      id: mpr,
      fam: fam,
      model: model,
      serial: hasSerial ? serialText : '',
      serialOk: serialOk,
      holder: holder === '—' ? '' : holder,
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
 * Parse assignment.md's "Active assignments" table into { mprId: 'Date Out' (raw string) }
 */
function parseActiveAssignmentDates(content) {
  const dates = {};
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

    const [, mpr, , , dateOut] = cells;
    if (!mpr || !mpr.startsWith('MPR-')) continue;

    dates[mpr] = dateOut;
  }

  return dates;
}

/**
 * Decide whether each fleet item needs a tag printed, and why.
 * Flags: permanent tag never logged, OR an active assignment whose student tag
 * was never logged or was printed before the assignment's Date Out (stale).
 */
function applyTagStatus(fleet, tagLog, activeAssignmentDates) {
  for (const item of fleet) {
    const log = tagLog[item.id] || {};
    const dateOut = activeAssignmentDates[item.id];
    const reasons = [];

    if (!log.permanent) {
      reasons.push('permanent tag not logged');
    }

    if (dateOut) {
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
    const activeAssignmentDates = parseActiveAssignmentDates(assignmentContent);
    applyTagStatus(fleet, tagLog, activeAssignmentDates);

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
