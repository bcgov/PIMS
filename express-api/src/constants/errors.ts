import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

// 4xx Error Codes
export const BadRequest400 = new ErrorWithCode('Bad request.', 400);

export const Unauthorized401 = new ErrorWithCode('User unauthorized.', 401);

export const Forbidden403 = new ErrorWithCode('Forbidden request.', 403);

export const NotFound404 = new ErrorWithCode('Resource not found.', 404);

export const NotAllowed405 = new ErrorWithCode('Method not allowed.', 405);

// 5xx Error Codes
export const ServerError500 = new ErrorWithCode(
  'The server has encountered a situation it does not know how to handle.',
  500,
);
