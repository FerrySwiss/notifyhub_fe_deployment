/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: { unoptimized: true },
    transpilePackages: ['nextauth'], // Add this line
};

export default nextConfig;
