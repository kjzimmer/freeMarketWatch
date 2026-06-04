const sharp = require('sharp');
const { readFileSync } = require('fs');
const { join } = require('path');

const svg = readFileSync(join(__dirname, '../client/public/favicon.svg'));

const sizes = [
  { size: 16,  name: 'favicon-16x16.png' },
  { size: 32,  name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

async function run() {
for (const { size, name } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../client/public/${name}`));
  console.log(`Generated ${name}`);
}

console.log('All favicon PNGs generated.');
}
run().catch(console.error);
