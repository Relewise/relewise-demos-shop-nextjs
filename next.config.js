/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['relewise.com'],
  },
  basePath: '/relewise-demos-shop-nextjs',
  output: 'export'
}

module.exports = nextConfig
