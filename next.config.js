/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["search1.kakaocdn.net", "firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
