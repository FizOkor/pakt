import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  
  outputFileTracingRoot: path.join(__dirname, '../../'), 

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
    return config;
  },
}

export default nextConfig