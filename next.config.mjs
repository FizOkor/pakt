/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Explicitly disable Turbopack for production build
  experimental: {
    turbo: undefined,
  },
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
    
    // Add module rules to ignore problematic packages
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    config.module.rules.push({
      test: /[\\/]node_modules[\\/](thread-stream|pino-pretty)[\\/]/,
      use: 'null-loader',
    });
    
    return config;
  },
}

export default nextConfig;