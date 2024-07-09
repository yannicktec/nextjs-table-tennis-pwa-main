// @ts-check
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
 
};


export default ()=> withSentryConfig(nextConfig, {
  org: "ansgar-hoyer",
  project: "tt-crew-app",

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  tunnelRoute: "/monitoring-tunnel",

  silent: false, // Can be used to suppress logs
});

