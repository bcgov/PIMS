import useAsync, { AsyncFunction } from './useAsync';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useDataLoader - Hook that helps you retrieve data from api calls.
 * Plug in an async api call into the first argument. Then use refresh to make the call, and data to access the response body.
 *
 * @param dataFetcher An async api call that returns some data in the response body.
 * @param errorHandler Handle any errors thrown using this.
 * @returns {AFResponse} data - async function response
 * @returns {Function} refreshData - makes the api call
 * @returns {boolean} isLoading - monitor request status
 * @returns {Error} error - thrown by making the call
 */
const useDataLoader = <AFArgs extends any[], AFResponse = unknown, AFError = unknown>(
  dataFetcher: AsyncFunction<AFArgs, AFResponse>,
  errorHandler: (error: AFError) => void = () => {},
) => {
  //We have this little useEffect here to avoid touching state if this hook suddenly gets unmounted.
  //React doesn't like it when this happens.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);
  const isMounted = useCallback(() => mountedRef.current, [mountedRef]);

  const [error, setError] = useState<AFError>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AFResponse>();
  const [oneTimeLoad, setOneTimeLoad] = useState(false);

  const getData = useAsync(dataFetcher);

  const refreshData = async (...args: AFArgs) => {
    setIsLoading(true);
    setError(undefined);
    let response: AFResponse = undefined;
    try {
      console.log('fetching data in refreshdata');
      response = await getData(...args);
      console.log('fetching data finished in refreshdata')
      if (!isMounted()) {
        console.log('!isMounted case of fetching data.');
        return;
      }
      setData(response);
    } catch (e) {
      console.log('hit error case of refreshdata')
      if (!isMounted()) {
        return;
      }
      setError(e);
      errorHandler?.(e);
    } finally {
      console.log('finally case of refreshdata');
      if (isMounted()) {
        setIsLoading(false);
      }
    }
    return response;
  };

  const loadOnce = async (...args: AFArgs) => {
    if (oneTimeLoad) {
      return;
    }
    setOneTimeLoad(true);
    return refreshData(...args);
  };

  return { refreshData, isLoading, data, error, loadOnce };
};

export default useDataLoader;
