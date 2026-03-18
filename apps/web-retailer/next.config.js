/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { domains: ["ifarm-assets.s3.sa-east-1.amazonaws.com"] },
};
module.exports = nextConfig;
