const xlsx = require('xlsx');
const path = require('path');

try {
  const filePath = path.join(__dirname, '..', 'SUGI   MENU LAST Updated Price KARIM GRAPHIC 1 UP last up.xlsx');
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  let categories = [];
  let currentCategory = null;
  let items = {};

  data.forEach((row, idx) => {
    if (row.length === 0) return;
    
    // Check if it's a category row. Usually column 0 has text and next columns are empty or it's a title row
    const col0 = row[0] ? row[0].toString().trim() : null;
    const col1 = row[1] ? row[1].toString().trim() : null;
    
    if (col0 && !col1 && row.length > 0 && !col0.includes('PRICES') && !col0.includes('الاسعار') && !col0.includes('RESTAURANT')) {
      // Looks like a category
      // Clean up category name (remove extra spaces and "calories")
      let catName = col0.split('calories')[0].trim();
      categories.push(catName);
      currentCategory = catName;
      items[currentCategory] = [];
    } else if (col0 && col1 === null && currentCategory) {
       // Might be an item where name is in col 0
       items[currentCategory].push(col0);
    } else if (col1 && currentCategory) {
       // Item where name is in col 1
       items[currentCategory].push(col1);
    }
  });

  console.log("EXCEL CATEGORIES:", categories);
  console.log("-------------------");
  console.log("ITEMS PER CATEGORY:");
  for (const cat of categories) {
    console.log(`- ${cat} (${items[cat]?.length || 0} items)`);
  }
} catch (error) {
  console.error(error);
}
