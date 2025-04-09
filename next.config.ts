/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

module.exports = nextConfig;
