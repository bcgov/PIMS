import matchers, { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

expect.extend(matchers);

var localStorageMock = (function() {
  var store: any = {};

  return {
    getKeys: function() {
      return store;
    },
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: any) {
      store[key] = value.toString();
    },
    removeItem: function(key: string) {
      store[key] = undefined;
    },
    clear: function() {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
