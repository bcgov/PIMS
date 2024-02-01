import useAsync, { AsyncFunction } from './useAsync';
import { useCallback, useEffect, useRef, useState } from 'react';

const useDataLoader = <AFArgs extends any[], AFResponse = unknown, AFError = unknown>(
  dataFetcher: AsyncFunction<AFArgs, AFResponse>,
  errorHandler: (error: AFError) => void,
) => {
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
  const getData = useAsync(dataFetcher);
  const refreshData = async (...args: AFArgs) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await getData(...args);
      if (!isMounted) {
        return;
      }
      setData(response);
    } catch (e) {
      if (!isMounted) {
        return;
      }
      setError(error);
      errorHandler?.(error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  return { refreshData, isLoading, data, error };
};

export default useDataLoader;