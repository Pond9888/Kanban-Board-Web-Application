#!/usr/bin/env node
const sharp = require('sharp')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

const svgBuffer = (size) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#bg)"/>
  <svg x="${Math.round(size * 0.2)}" y="${Math.round(size * 0.2)}" width="${Math.round(size * 0.6)}" height="${Math.round(size * 0.6)}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
  </svg>
</svg>`)

const iconsDir = path.join(__dirname, '../public/icons')

async function generate() {
  for (const size of sizes) {
    const outPath = path.join(iconsDir, `icon-${size}x${size}.png`)
    await sharp(svgBuffer(size)).resize(size, size).png().toFile(outPath)
    console.log(`Generated: icon-${size}x${size}.png`)
  }

  // Also generate favicon
  const faviconPath = path.join(__dirname, '../public/favicon.png')
  await sharp(svgBuffer(32)).resize(32, 32).png().toFile(faviconPath)
  console.log('Generated: favicon.png')

  // Generate Android adaptive icon background (108x108)
  const adaptiveBgPath = path.join(iconsDir, 'adaptive-icon-bg.png')
  await sharp(svgBuffer(108)).resize(108, 108).png().toFile(adaptiveBgPath)
  console.log('Generated: adaptive-icon-bg.png')

  console.log('\nAll PNG icons generated successfully!')
}

generate().catch(console.error)
