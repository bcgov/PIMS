import { useEffect, EffectCallback, DependencyList } from 'react';
import { useDeepCompareMemoize } from './useDeepCompareMemoize';

/**
 * `useDeepCompareEffect` will return a memoized version of the callback that
 * only runs if one of the `deps` has changed.
 *
 * Usage note: only use this if `deps` are objects or arrays that contain
 * objects. Otherwise you should just use React.useEffect.
 *
 */
const useDeepCompareEffect = (callback: EffectCallback, dependencies: DependencyList) => {
  useEffect(callback, useDeepCompareMemoize(dependencies));
};

export default useDeepCompareEffect;
