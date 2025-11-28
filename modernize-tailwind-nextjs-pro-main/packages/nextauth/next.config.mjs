/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: { unoptimized: true },
    async rewrites() {
        return [
            {
                source: '/signup/:path*',
                destination: 'http://localhost:8000/signup/:path*',
            },
            {
                source: '/o/:path*',
                destination: 'http://localhost:8000/o/:path*',
            },
            {
                source: '/graphql/:path*',
                destination: 'http://localhost:8000/graphql/:path*',
            },
        ];
    },
};

export default nextConfig;
