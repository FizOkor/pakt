/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure Turbopack to handle the problematic modules
  turbopack: {
    resolveAlias: {
      'thread-stream': false,
      'pino-pretty': false,
      'worker_threads': false,
    },
  },
  // Keep webpack for fallback, but Turbopack will be used
  webpack: (config, { isServer }) => {
    if (!isServer) {
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