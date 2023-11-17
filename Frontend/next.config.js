


const nextConfig = {
  reactStrictMode: true,
  images :{
    unoptimized: true,
    domains :["ipfs.infura.io","sal-dapp.infura-ipfs.io"]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        "fs": false,
        "net": false,
        "tls": false
      }
    }
    return config
  }
}

module.exports = nextConfig
