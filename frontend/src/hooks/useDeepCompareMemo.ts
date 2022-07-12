import React from 'react';

import { useDeepCompareMemoize } from './useDeepCompareMemoize';

/**
 * `useDeepCompareMemo` will only recompute the memoized value when one of the
 * `deps` has changed.
 *
 * Usage note: only use this if `deps` are objects or arrays that contain
 * objects. Otherwise you should just use React.useMemo.
 *
 */
function useDeepCompareMemo<T>(factory: () => T, dependencies: React.DependencyList) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(factory, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareMemo;
