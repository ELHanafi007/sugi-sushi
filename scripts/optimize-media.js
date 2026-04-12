const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = './assets/source';
const OUTPUT_DIR = './public/media/optimized';

async function processImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.tif') || f.endsWith('.tiff'));

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const baseName = path.parse(file).name.replace(/\s+/g, '-').toLowerCase();

    console.log(`Processing master asset: ${file}...`);

    try {
      // 1. Ultra High Res (For Zoom/Detail)
      await sharp(inputPath)
        .resize(3840) // 4K width
        .avif({ quality: 80, chromaSubsampling: '4:2:0' })
        .toFile(path.join(OUTPUT_DIR, `${baseName}-ultra.avif`));

      // 2. Hero Preview (Standard)
      await sharp(inputPath)
        .resize(1920)
        .avif({ quality: 70 })
        .toFile(path.join(OUTPUT_DIR, `${baseName}-hero.avif`));

      // 3. Card/Thumbnail
      await sharp(inputPath)
        .resize(800)
        .webp({ quality: 75 })
        .toFile(path.join(OUTPUT_DIR, `${baseName}-card.webp`));

      // 4. LQIP (Low Quality Image Placeholder)
      const lqip = await sharp(inputPath)
        .resize(20)
        .blur(5)
        .toBuffer();
      
      fs.writeFileSync(path.join(OUTPUT_DIR, `${baseName}-lqip.txt`), lqip.toString('base64'));

      console.log(`✓ Generated variants for ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages().catch(console.error);
