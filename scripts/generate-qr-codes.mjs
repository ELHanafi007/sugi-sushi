#!/usr/bin/env node
/**
 * SUGI SUSHI — QR Code Generator
 * 
 * Generates one QR code per restaurant table.
 * Each QR code links to: {BASE_URL}/menu?table={tableId}
 * 
 * When a customer scans their table's QR code, the ordering system
 * automatically identifies which table they are at and associates
 * all their orders with that table.
 * 
 * Output: ~/Desktop/66/  (one PNG per table)
 */

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

// ─── Configuration ──────────────────────────────────────────
// Change BASE_URL to your production domain when deploying
const BASE_URL = 'https://www.sugisushi.com.sa';

const OUTPUT_DIR = join(process.env.HOME, 'Desktop', '66');

// All 21 restaurant tables and bar seats (14 Tables + 7 Bar Seats)
const TABLES = [
  { id: 't01', label: 'Table 1', zone: 'Side Wall',     seats: 2 },
  { id: 't02', label: 'Table 2', zone: 'Side Wall',     seats: 2 },
  { id: 't03', label: 'Table 3', zone: 'Side Wall',     seats: 2 },
  { id: 't04', label: 'Table 4', zone: 'Side Wall',     seats: 2 },
  { id: 't05', label: 'Table 5', zone: 'Side Wall',     seats: 2 },
  { id: 't06', label: 'Table 6', zone: 'Side Wall',     seats: 2 },
  { id: 't07', label: 'Table 7', zone: 'Side Wall',     seats: 2 },
  { id: 't08', label: 'Table 8', zone: 'Reception',     seats: 2 },
  { id: 't09', label: 'Table 9', zone: 'Main Hall',     seats: 4 },
  { id: 't10', label: 'Table 10', zone: 'Main Hall',    seats: 4 },
  { id: 't11', label: 'Table 11', zone: 'Main Hall',    seats: 4 },
  { id: 't12', label: 'Table 12', zone: 'Window Booths', seats: 6 },
  { id: 't13', label: 'Table 13', zone: 'Window Booths', seats: 6 },
  { id: 't14', label: 'Table 14', zone: 'Window Booths', seats: 6 },
  { id: 'b01', label: 'Bar 1', zone: 'Sushi Bar',       seats: 1 },
  { id: 'b02', label: 'Bar 2', zone: 'Sushi Bar',       seats: 1 },
  { id: 'b03', label: 'Bar 3', zone: 'Sushi Bar',       seats: 1 },
  { id: 'b04', label: 'Bar 4', zone: 'Sushi Bar',       seats: 1 },
  { id: 'b05', label: 'Bar 5', zone: 'Sushi Bar',       seats: 1 },
  { id: 'b06', label: 'Bar 6', zone: 'Sushi Bar',       seats: 1 },
  { id: 'b07', label: 'Bar 7', zone: 'Sushi Bar',       seats: 1 },
];

// ─── QR Code Generation (pure SVG → PNG via sharp) ──────────

/**
 * Encodes data into a QR code bit matrix using a simplified
 * QR code generator (Version 2, Error Correction Level M).
 * For reliability, we use the `qrcode` npm package instead.
 */

async function main() {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   🍣 SUGI SUSHI — QR Code Generator  ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');

  // 1. Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`  📁 Output directory: ${OUTPUT_DIR}`);
  console.log('');

  // 2. Dynamically import qrcode
  let QRCode;
  try {
    QRCode = (await import('qrcode')).default;
  } catch {
    console.log('  📦 Installing qrcode package...');
    execSync('npm install --no-save qrcode', { 
      cwd: join(process.env.HOME, 'Desktop', 'sugi-sushi'),
      stdio: 'pipe' 
    });
    QRCode = (await import('qrcode')).default;
  }

  // 3. Generate QR codes
  console.log(`  🔄 Generating ${TABLES.length} QR codes...\n`);

  for (let i = 0; i < TABLES.length; i++) {
    const table = TABLES[i];
    const url = `${BASE_URL}/menu?table=${table.id}`;
    const filename = `table${i + 1}_${table.label}.png`;
    const filepath = join(OUTPUT_DIR, filename);

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 800,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // Highest error correction
    });

    await writeFile(filepath, qrBuffer);

    const num = String(i + 1).padStart(2, '0');
    console.log(`  ✅ ${num}. ${filename}`);
    console.log(`      → ${url}`);
    console.log(`      Zone: ${table.zone} | Seats: ${table.seats}`);
    console.log('');
  }

  // 4. Generate a summary README
  let readme = '# SUGI SUSHI — Table QR Codes\n\n';
  readme += `Generated on: ${new Date().toLocaleString()}\n`;
  readme += `Base URL: ${BASE_URL}\n\n`;
  readme += '> **Important**: When deploying to production, update the BASE_URL in\n';
  readme += '> `scripts/generate-qr-codes.mjs` and regenerate the QR codes.\n\n';
  readme += '## How It Works\n\n';
  readme += '1. Each table has a unique QR code placed on it\n';
  readme += '2. Customer scans the QR code with their phone\n';
  readme += '3. The QR code opens the menu page with the table ID embedded in the URL\n';
  readme += '4. The system automatically creates/recovers a session for that table\n';
  readme += '5. All orders placed through that session are tagged with the table number\n';
  readme += '6. Kitchen and cashier dashboards show exactly which table ordered what\n\n';
  readme += '## Table → QR Code Mapping\n\n';
  readme += '| # | File | Table ID | Label | Zone | Seats | URL |\n';
  readme += '|---|------|----------|-------|------|-------|-----|\n';

  TABLES.forEach((table, i) => {
    const num = i + 1;
    const filename = `table${num}_${table.label}.png`;
    const url = `${BASE_URL}/menu?table=${table.id}`;
    readme += `| ${num} | ${filename} | ${table.id} | ${table.label} | ${table.zone} | ${table.seats} | ${url} |\n`;
  });

  await writeFile(join(OUTPUT_DIR, 'README.md'), readme);

  console.log('  ─────────────────────────────────────');
  console.log(`  🎉 Done! ${TABLES.length} QR codes saved to:`);
  console.log(`     ${OUTPUT_DIR}`);
  console.log('');
  console.log('  📋 README.md with mapping table also generated.');
  console.log('');
  console.log('  ⚠️  These QR codes use: ' + BASE_URL);
  console.log('     Update BASE_URL for production and re-run.');
  console.log('');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
