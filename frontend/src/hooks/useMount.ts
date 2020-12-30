import React from 'react';

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * This function will only be run on Mount and Unmount.
 * @param effect Imperative function that can return a cleanup function.
 */
export const useMount = (effect: React.EffectCallback) => {
  React.useEffect(() => {
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
