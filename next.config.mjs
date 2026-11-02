/** @type {import('next').NextConfig} */
const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig = {
  // Browser calls go to /backend/* on this same domain and are proxied to the
  // Express API. That keeps the API's HTTPOnly JWT cookie first-party, so it
  // survives reloads and isn't blocked as a third-party cookie.
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
