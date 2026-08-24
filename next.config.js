/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@xenova/transformers', 'pdf-parse', 'onnxruntime-node'],
  },
}
module.exports = nextConfig
