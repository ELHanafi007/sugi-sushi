const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../menu_update.xlsx');
const workbook = xlsx.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

console.log('--- SEARCHING FOR PORTIONS (California / 4pcs / 8pcs) ---');
data.forEach((row, i) => {
  const rowStr = JSON.stringify(row);
  if (rowStr.toLowerCase().includes('california') || rowStr.includes('4pcs') || rowStr.includes('8pcs')) {
    console.log(`Row ${i}:`, row);
  }
});
