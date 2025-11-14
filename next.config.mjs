/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to bundle these packages on the client
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
        'pino-pretty': false,
        'thread-stream': false,
        'worker_threads': false,
      };

      // Exclude problematic modules from client-side bundles
      config.plugins.push(
        new config.optimization.splitChunks.cacheGroups.constructor({
          test: /[\\/]node_modules[\\/](thread-stream|pino)[\\/]/,
          name: 'vendor-pino',
          enforce: true,
        })
      );
    }
    
    // Add externals for SSR
    config.externals = [
      ...(config.externals || []),
      { 'thread-stream': 'commonjs thread-stream' },
      { 'pino-pretty': 'commonjs pino-pretty' },
    ];
    
    return config;
  },
}

export default nextConfig;