import { ZodError } from 'zod';

export const zodToFormikErrors = (error: ZodError) => {
  const errors: Record<string, string | Record<string, string>> = {};

  if (error instanceof ZodError)
    error.errors.forEach((errorDetail) => {
      const path = errorDetail.path;
      let current = errors;
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (i === path.length - 1) {
          current[key] = errorDetail.message;
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key] as Record<string, string>;
        }
      }
    });

  return errors;
};
