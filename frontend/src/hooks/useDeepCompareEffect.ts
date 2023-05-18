import { DependencyList, EffectCallback, useEffect } from 'react';

import { useDeepCompareMemoize } from './useDeepCompareMemoize';

/**
 * `useDeepCompareEffect` will return a memoized version of the callback that
 * only runs if one of the `deps` has changed.
 *
 * Usage note: only use this if `deps` are objects or arrays that contain
 * objects. Otherwise you should just use React.useEffect.
 *
 * This is because useEffect will not trigger a change by a
 * change in the object or array properties of a dependency.
 */
const useDeepCompareEffect = (callback: EffectCallback, dependencies: DependencyList) => {
  useEffect(callback, useDeepCompareMemoize(dependencies));
};

export default useDeepCompareEffect;
