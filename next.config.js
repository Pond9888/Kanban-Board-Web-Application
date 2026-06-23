/** @type {import('next').NextConfig} */
const isMobileBuild = process.env.BUILD_TARGET === 'mobile'

const nextConfig = {
  ...(isMobileBuild && {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
  }),
}

module.exports = nextConfig
