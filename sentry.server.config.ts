import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://54e4b9ddf27c3a63fed726c3f7d72aa7@o4507329657307136.ingest.de.sentry.io/4507549097721936",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
