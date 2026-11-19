/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/floor', destination: '/floor.html' }];
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; form-action 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
        },
      ],
    }];
  },
};
export default nextConfig;
