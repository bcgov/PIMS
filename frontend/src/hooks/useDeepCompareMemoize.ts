import deepEqual from 'dequal';
import React from 'react';

/** util function used by other useDeep* hooks */
export function useDeepCompareMemoize(value: React.DependencyList) {
  const ref = React.useRef<React.DependencyList>([]);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
