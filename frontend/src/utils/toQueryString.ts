/**
 * Converts an object into query string parameters.
 * @param params Object to convert to query parameters.
 * @returns Query string parameters.
 */
export const toQueryString = (params: object) => {
  if (params === undefined || params === null) return '';
  return Object.keys(params)
    .filter((key) => (params as any)[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent((params as any)[key])}`)
    .join('&');
};
