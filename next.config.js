const path = require("path");
const withFonts = require("next-fonts");

module.exports = withFonts({
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    REACT_APP_FB_CLIENT_ID: process.env.REACT_APP_FB_CLIENT_ID,
    FB_SCOPE: process.env.FB_SCOPE,
    REACT_APP_TWITTER_CLIENT_ID: process.env.REACT_APP_TWITTER_CLIENT_ID,
    REACT_APP_TWITTER_CLIENT_SECRET:
    process.env.REACT_APP_TWITTER_CLIENT_SECRET,
    REACT_APP_TWITTER_CLIENT_API_CALLBACK:
    process.env.REACT_APP_TWITTER_CLIENT_API_CALLBACK,
    REACT_APP_TWITCH_CLIENT_ID: process.env.REACT_APP_TWITCH_CLIENT_ID,
    REACT_APP_TWITCH_CLIENT_SECRET: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
    APPLE_KEY_ID: process.env.APPLE_KEY_ID,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    REACT_APP_APPLE_CLIENT_ID: process.env.REACT_APP_APPLE_CLIENT_ID,
    REACT_APP_APPLE_CALLBACK: process.env.REACT_APP_APPLE_CALLBACK,
    APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
    REACT_APP_IMAGE_URL: process.env.REACT_APP_IMAGE_URL,
    REACT_APP_IMAGE_COLLECTION_URL: process.env.REACT_APP_IMAGE_COLLECTION_URL,
    REACT_APP_SITE_KEY: process.env.REACT_APP_SITE_KEY,
    DOMAIN: process.env.DOMAIN,
  },
  webpack: (config) => {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },
  publicRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
  },
  enableSvg: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});