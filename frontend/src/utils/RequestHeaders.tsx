/**
 * Utility class for various request Headers.
 */
import { store } from 'App';

// This file is anticipated to have multiple exports
// eslint-disable-next-line import/prefer-default-export
export const createRequestHeader = () => {
  return {
    //TODO: update this to properly use a selector.
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${store.getState().jwt}`,
    },
  };
};
