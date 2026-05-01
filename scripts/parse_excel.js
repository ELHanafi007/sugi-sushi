const xlsx = require('xlsx');
const path = require('path');

try {
  const filePath = path.join(__dirname, '..', 'SUGI   MENU LAST Updated Price KARIM GRAPHIC 1 UP last up.xlsx');
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(JSON.stringify(data.slice(0, 100), null, 2));
} catch (error) {
  console.error(error);
}
