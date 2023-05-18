/**
 * Converts a query string to an object.
 * @param query The query string to convert to an object.
 * @returns A new instance of an object.
 */
export const fromQueryString = (query?: string): any => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
        const [key, value] = param.split('=');
        (params as any)[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, {})
    : {};
};
