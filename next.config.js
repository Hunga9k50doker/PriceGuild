const path = require("path");
const withFonts = require("next-fonts");

module.exports = withFonts({
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    REACT_APP_FB_CLIENT_ID: process.env.REACT_APP_FB_CLIENT_ID,
    REACT_APP_TWITTER_CLIENT_API_CALLBACK: 
    process.env.REACT_APP_TWITTER_CLIENT_API_CALLBACK,
    REACT_APP_TWITCH_CLIENT_ID: process.env.REACT_APP_TWITCH_CLIENT_ID,
    REACT_APP_APPLE_CLIENT_ID: process.env.REACT_APP_APPLE_CLIENT_ID,
    REACT_APP_APPLE_CALLBACK: process.env.REACT_APP_APPLE_CALLBACK,
    REACT_APP_IMAGE_URL: process.env.REACT_APP_IMAGE_URL,
    REACT_APP_IMAGE_COLLECTION_URL: process.env.REACT_APP_IMAGE_COLLECTION_URL, 
    REACT_APP_SITE_KEY: process.env.REACT_APP_SITE_KEY, 
    DOMAIN: process.env.DOMAIN,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    MAINTENANCE_FS_COLLECTION_NAME: process.env.MAINTENANCE_FS_COLLECTION_NAME
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