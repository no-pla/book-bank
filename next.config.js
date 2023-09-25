/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  minimumCacheTTL: 60,
  images: {
    domains: [
      "search1.kakaocdn.net",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
