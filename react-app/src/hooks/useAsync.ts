import { useRef } from 'react';

export type AsyncFunction<AFArgs extends any[], AFResponse> = (
  ...args: AFArgs
) => Promise<AFResponse>;

/**
 * useAsync - Wraps an asyncronous function in a hook.
 * This is useful when trying to make an asyncronous call inside a component that may be duplicated
 * if it gets re-rendered.
 *
 * @param asyncFunction Any arbitray async call.
 * @returns Promise returned by resolving the async call.
 */
const useAsync = <AFArgs extends any[], AFResponse>(
  asyncFunction: AsyncFunction<AFArgs, AFResponse>,
): AsyncFunction<AFArgs, AFResponse> => {
  const promiseResponse = useRef<Promise<AFResponse>>();
  const isPending = useRef(false);
  const asyncFunctionWrapper: AsyncFunction<AFArgs, AFResponse> = async (...args) => {
    //This evaluation is the crux of it. If we already have a reference to the async function
    //and isPending is true, then we already called this and we can just return the reference to the current
    //async call instead of making a new one.
    console.log('invoking async wrapper');
    if (promiseResponse.current && isPending.current) {
      console.log(`will return current reference in useAsync`);
      return promiseResponse.current;
    }

    isPending.current = true;

    //An example of one of few instances where there is probably not a real equivalent using await.
    promiseResponse.current = asyncFunction(...args)
      .then((response: AFResponse) => {
        isPending.current = false;
        return response;
      })
      .catch((error: unknown) => {
        isPending.current = false;
        throw error;
      });

    return promiseResponse.current;
  };

  return asyncFunctionWrapper;
};

export default useAsync;
