const withPWA = require("next-pwa")({
  dest: "public",
  disable: false,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // next.js config
});
