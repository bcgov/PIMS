import { ZodError } from 'zod';

export const zodToFormikErrors = (error: ZodError) => {
  const errors: Record<string, string> = {};

  error.errors.forEach((errorDetail) => {
    let path = errorDetail.path.join('.');
    if (path === '') {
      path = '_error';
    }
    errors[path] = errorDetail.message;
  });

  return errors;
};
