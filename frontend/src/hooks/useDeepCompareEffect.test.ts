import { renderHook } from '@testing-library/react-hooks';

import useDeepCompareEffect from './useDeepCompareEffect';

describe('useDeepCompareEffect hook', () => {
  it('handles changing values as expected', () => {
    const callback = jest.fn();
    let deps = [1, { a: 'b' }, true];
    const { rerender } = renderHook(() => useDeepCompareEffect(callback, deps));

    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();

    // no change
    rerender();
    expect(callback).toHaveBeenCalledTimes(0);
    callback.mockClear();

    // no-change (new object with same properties)
    deps = [1, { a: 'b' }, true];
    rerender();
    expect(callback).toHaveBeenCalledTimes(0);
    callback.mockClear();

    // change (new primitive value)
    deps = [2, { a: 'b' }, true];
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();

    // no-change
    rerender();
    expect(callback).toHaveBeenCalledTimes(0);
    callback.mockClear();

    // change (new primitive value)
    deps = [1, { a: 'b' }, false];
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();

    // change (new properties on object)
    deps = [1, { a: 'c' }, false];
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();
  });

  it('works with deep object similarities/differences', () => {
    const callback = jest.fn();
    let deps: any[] = [{ a: { b: { c: 'd' } } }];
    const { rerender } = renderHook(() => useDeepCompareEffect(callback, deps));
    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();

    // change primitive value
    deps = [{ a: { b: { c: 'e' } } }];
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();

    // no-change
    deps = [{ a: { b: { c: 'e' } } }];
    rerender();
    expect(callback).toHaveBeenCalledTimes(0);
    callback.mockClear();

    // add property
    deps = [{ a: { b: { c: 'e' }, f: 'g' } }];
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
    callback.mockClear();
  });
});
