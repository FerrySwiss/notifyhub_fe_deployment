/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: { unoptimized: true },
    async rewrites() {
        return [
            {
                source: '/app/:path*',
                destination: 'http://localhost:8000/app/:path*', // Proxy to Django backend for /app endpoints
            },
            {
                source: '/o/:path*',
                destination: 'http://localhost:8000/o/:path*', // Proxy to Django backend for /o (OAuth) endpoints
            },
        ];
    },
};

export default nextConfig;
