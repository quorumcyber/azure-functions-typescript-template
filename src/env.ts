import { z } from 'zod';

export const logZodError = (error: z.ZodError) => {
  const errors = error.issues.reduce<Record<string, { code: string; message: string }>>(
    (obj, issue) => ({ ...obj, [issue.path.join('.')]: { code: issue.code, message: issue.message } }),
    {},
  );
  console.table(errors);
};

if (typeof process.env.NODEENV === 'undefined') {
  // eslint-disable-next-line
  const config: { Values: { [key: string]: string } } = require('../local.settings.json');
  const dict = config.Values;
  const keys = Object.keys(dict);
  keys.forEach((key) => {
    process.env[key] = dict[key];
  });
}

/**
 * Application environment variables
 */
const envSchema = z.object({
  NODEENV: z.string(),
});

let envVariables = {} as z.infer<typeof envSchema>;
try {
  envVariables = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    logZodError(error);
    process.exit(1);
  }
}
export default envVariables;
