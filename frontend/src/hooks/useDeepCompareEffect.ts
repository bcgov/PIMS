import { useRef, useEffect, EffectCallback, DependencyList } from 'react';
import deepEqual from 'dequal';

const useDeepCompareMemoize = (value: any) => {
  const ref = useRef();

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

const useDeepCompareEffect = (callback: EffectCallback, dependencies?: DependencyList) => {
  useEffect(callback, useDeepCompareMemoize(dependencies));
};

export default useDeepCompareEffect;
