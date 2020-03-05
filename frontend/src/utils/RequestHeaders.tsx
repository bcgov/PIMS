/**
 * Utility class for various request Headers.
 */

// This file is anticipated to have multiple exports
// eslint-disable-next-line import/prefer-default-export
export const createRequestHeader = () => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${localStorage.getItem('jwt')}`, //TODO: handle token storage during login/logout.
  },
});
