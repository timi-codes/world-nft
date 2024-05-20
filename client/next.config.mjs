/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.decentralized-content.com',
            },
            {
                protocol: 'https',
                hostname: 'remote-image.decentralized-content.com',
            },
        ],
    },
};

export default nextConfig;
