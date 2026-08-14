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
      i += 2; // Skip separator line
      continue;
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

/**
 * Generate JavaScript code for FLEET array
 */
function generateFleetCode(fleet) {
  const lines = fleet.map(item => {
    const serialOkStr = item.serialOk === true ? 'true' : item.serialOk === false ? 'false' : 'null';
    return `  {id:"${item.id}", fam:"${item.fam}", model:"${item.model}", serial:"${item.serial}", serialOk:${serialOkStr}, holder:"${item.holder}"},`;
  });

  return 'const FLEET = [\n' + lines.join('\n') + '\n];';
}

/**
 * Read template and replace FLEET array
 */
function generateHTML(inventoryContent) {
  let templateContent = fs.readFileSync(TAGS_TEMPLATE_PATH, 'utf-8');

  const fleet = parseInventory(inventoryContent);
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
    const htmlContent = generateHTML(inventoryContent);

    fs.writeFileSync(OUTPUT_PATH, htmlContent, 'utf-8');

    const fleet = parseInventory(inventoryContent);
    console.log(`✓ Generated ${OUTPUT_PATH}`);
    console.log(`  ${fleet.length} instruments in fleet`);

  } catch (error) {
    console.error('✗ Error generating tags:', error.message);
    process.exit(1);
  }
}

main();
