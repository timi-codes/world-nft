/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
    images: {
        domains: [
            "gateway.pinata.cloud",
            "ipfs.decentralized-content.com",
            "remote-image.decentralized-content.com",
        ],
    },
};

export default nextConfig;
