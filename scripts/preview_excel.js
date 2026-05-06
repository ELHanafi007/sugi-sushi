const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../menu_update.xlsx');
const workbook = xlsx.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

console.log('--- EXCEL PREVIEW (First 50 rows) ---');
data.slice(0, 50).forEach((row, i) => {
  console.log(`Row ${i}:`, row);
});
