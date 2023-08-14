/** @type {import('next').NextConfig} */

const ON_GITHUB_PAGES = process.env.NODE_ENV === "production";

const repoName = "relewise-demos-shop-nextjs";

const basePath = ON_GITHUB_PAGES ? `/${repoName}` : "";
const assetPrefix = ON_GITHUB_PAGES ? `/${repoName}/` : "";

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["relewise.com"]
  },
  output: "export",
  basePath: basePath,
  assetPrefix: assetPrefix
};

module.exports = nextConfig;
