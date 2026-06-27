const nextConfig = {
  // React Strict Mode remounts WebGL canvases and crashes R3F in dev.
  reactStrictMode: false,
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
