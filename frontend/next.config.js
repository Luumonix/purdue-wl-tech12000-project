/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate build ID to bust cache
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  // Disable caching in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
