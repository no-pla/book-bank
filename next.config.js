/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "search1.kakaocdn.net",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
