/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allows the tool pages to be embedded in an <iframe> on your blog/CMS.
  // Tighten this to your exact blog domain before going live, e.g.
  // "frame-ancestors 'self' https://www.yourblog.com"
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' *" }
        ]
      }
    ];
  }
};

export default nextConfig;
