import matchers, { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

expect.extend(matchers);

const localStorageMock = (() => {
  let store: any = {};

  return {
    getKeys: () => {
      return store;
    },
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: any) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      store[key] = undefined;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
