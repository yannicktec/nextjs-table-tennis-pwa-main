import { z } from "zod";

const envVariables = z.object({
    SENTRY_AUTH_TOKEN: z.string(),
    DATABASE: z.string(),
    DB_HOST: z.string(),
    DB_PASSWORD: z.string(),
    DB_USER: z.string(),
});

const env = envVariables.parse(process.env);
export default env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
