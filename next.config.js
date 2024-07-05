// @ts-check
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = withSentryConfig(nextConfig, {
  org: "ansgar-hoyer",
  project: "tt-crew-app",

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  tunnelRoute: "/monitoring-tunnel",

  silent: false, // Can be used to suppress logs
});
