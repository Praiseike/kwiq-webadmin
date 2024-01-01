const withTwin = require('./withTwin.js')

/**
 * @type {import('next').NextConfig}
 */
module.exports = withTwin({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn2.thecatapi.com', 'res.cloudinary.com', 'nigerianbanks.xyz'],
  },
})
