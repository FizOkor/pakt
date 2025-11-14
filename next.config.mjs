/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use webpack explicitly to avoid Turbopack conflicts
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        util: false,
        url: false,
        http: false,
        https: false,
        zlib: false,
        'pino-pretty': false,
        'thread-stream': false,
        'worker_threads': false,
      };
    }
    return config;
  },
}

export default nextConfig;