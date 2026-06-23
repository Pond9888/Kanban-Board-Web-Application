#!/usr/bin/env node
// Generates PNG icons from SVG for PWA and Capacitor Android app.
// Run: node scripts/generate-icons.js
// Requires: npm install sharp (not included in prod deps)

const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

const svgTemplate = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size * 0.006})">
    <path stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"
      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
  </g>
</svg>`

const iconsDir = path.join(__dirname, '../public/icons')

sizes.forEach((size) => {
  const svg = svgTemplate(size)
  const outputPath = path.join(iconsDir, `icon-${size}x${size}.svg`)
  fs.writeFileSync(outputPath, svg)
  console.log(`Generated: icon-${size}x${size}.svg`)
})

console.log('\nSVG icons generated in public/icons/')
console.log('For production PNG icons, install sharp and run: node scripts/generate-icons-png.js')
