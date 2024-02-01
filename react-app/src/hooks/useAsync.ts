import { useRef } from 'react';

export type AsyncFunction<AFArgs extends any[], AFResponse> = (
  ...args: AFArgs
) => Promise<AFResponse>;

const useAsync = <AFArgs extends any[], AFResponse>(
  asyncFunction: AsyncFunction<AFArgs, AFResponse>,
): AsyncFunction<AFArgs, AFResponse> => {
  const promiseResponse = useRef<Promise<AFResponse>>();
  const isPending = useRef(false);
  const asyncFunctionWrapper: AsyncFunction<AFArgs, AFResponse> = async (...args) => {
    if (promiseResponse.current && isPending.current) {
      return promiseResponse.current;
    }

    isPending.current = true;
    promiseResponse.current = asyncFunction(...args).then(
      (response: AFResponse) => {
        isPending.current = false;

        return response;
      },
      (error) => {
        isPending.current = false;

        throw error;
      },
    );

    return promiseResponse.current;
  };

  return asyncFunctionWrapper;
};

export default useAsync;
