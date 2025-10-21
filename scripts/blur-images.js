const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images/hero');
const outputDir = path.join(__dirname, '../public/images/hero-blurred');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// List of images to blur
const images = [
  'house-afternoon.webp',
  'house-halloween.webp',
  'house-morning.webp',
  'house-night.webp',
  'house-rainy.webp',
  'house-sunset.webp'
];

async function blurImages() {
  console.log('Creating pre-blurred mobile background images...\n');

  for (const image of images) {
    const inputPath = path.join(inputDir, image);
    const outputPath = path.join(outputDir, image);

    try {
      await sharp(inputPath)
        .blur(5) // Apply 5px Gaussian blur
        .webp({ quality: 85 }) // Maintain quality at 85
        .toFile(outputPath);

      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);

      console.log(`✓ ${image}`);
      console.log(`  Original: ${(inputStats.size / 1024).toFixed(1)} KB`);
      console.log(`  Blurred:  ${(outputStats.size / 1024).toFixed(1)} KB\n`);
    } catch (error) {
      console.error(`✗ Error processing ${image}:`, error.message);
    }
  }

  console.log('Done! Pre-blurred images saved to public/images/hero-blurred/');
}

blurImages().catch(console.error);
