import { useContext } from 'react';
import { AsyncFunction } from './useAsync';
import { SnackBarContext } from '@/contexts/snackbarContext';
import useDataLoader from './useDataLoader';
import { FetchResponse } from './useFetch';

const useDataSubmitter = <AFArgs extends any[], AFError = unknown>(
  dataFetcher: AsyncFunction<AFArgs, FetchResponse>,
  errorHandler: (error: AFError) => void = () => {},
) => {
  const snackbar = useContext(SnackBarContext);
  const { refreshData, isLoading, data, error } = useDataLoader(dataFetcher, errorHandler);
  const wrapDataFetcher = async (...args: AFArgs) => {
    return refreshData(...args)
      .then((response) => {
        if (!response?.ok) {
          snackbar.setMessageState({
            open: true,
            text: `Submission failed with code ${response?.status}. Message: ${response?.parsedBody ?? 'No message.'}`,
            style: snackbar.styles.warning,
          });
        } else {
          snackbar.setMessageState({
            open: true,
            text: 'Submission successful.',
            style: snackbar.styles.success,
          });
        }
        return response;
      })
      .catch((e) => {
        snackbar.setMessageState({
          open: true,
          text: 'Submission failed due to exception: ' + e.message,
          style: snackbar.styles.warning,
        });
      });
  };
  return { submit: wrapDataFetcher, submitting: isLoading, data, error };
};

export default useDataSubmitter;
