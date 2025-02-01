import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = {
  dest: "public",
};

const withPWAConfigured = withPWA(pwaConfig);

export default withPWAConfigured({
  // Your Next.js config
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5008/api/:path*',
      },
    ]
}
});
 