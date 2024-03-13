// Decodes a Base64-encoded string to a JSON object.
export const decodeJWT = (jwt: string) => {
  try {
    return JSON.parse(Buffer.from(jwt, 'base64').toString('ascii'));
  } catch {
    throw new Error('Invalid input in decodeJWT()');
  }
};
