// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-styled-components';

// Mock window.snowplow
window.snowplow = jest.fn();

const localStorageMock = (function () {
  let store: any = {};

  return {
    getKeys: function () {
      return store;
    },
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: any) {
      store[key] = value.toString();
    },
    removeItem: function (key: string) {
      store[key] = undefined;
    },
    clear: function () {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
