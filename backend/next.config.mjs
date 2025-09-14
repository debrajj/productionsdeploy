/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return [
      {
        source: '/api/media/file/:path*',
        destination: '/media/:path*',
      },
    ]
  },
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  serverExternalPackages: ['sharp', 'mongodb', 'mongoose', 'mongoose-paginate-v2'],
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          payload: {
            name: 'payload',
            chunks: 'all',
            test: /[\/\\]node_modules[\/\\](@payloadcms|payload)[\/\\]/,
            priority: 20,
          },
        },
      },
    }
    
    if (isServer) {
      config.externals = [...(config.externals || []), 'date-fns', 'mongoose', 'mongoose-paginate-v2']
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
      
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/compiler-runtime': 'react-compiler-runtime',
      }
    }
    
    return config
  },

  
  // Serve static files from media directory and handle CORS
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.CORS_ORIGINS || 'http://localhost:8080,http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}

export default nextConfig