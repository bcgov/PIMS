import { useContext } from 'react';
import { AsyncFunction } from './useAsync';
import { SnackBarContext } from '@/contexts/snackbarContext';
import useDataLoader from './useDataLoader';

const useDataSubmitter = <AFArgs extends any[], AFError = unknown>(
  dataFetcher: AsyncFunction<AFArgs, { parsedBody; status: number }>,
  errorHandler: (error: AFError) => void = () => {},
) => {
  const snackbar = useContext(SnackBarContext);
  const { refreshData, isLoading, data, error } = useDataLoader(dataFetcher, errorHandler);
  const wrapDataFetcher = async (...args: AFArgs) => {
    refreshData(...args)
      .then((response) => {
        const status = response?.status;
        if (status && Number(status) >= 400) {
          snackbar.setMessageState({
            open: true,
            text: `Submission failed with code ${status}.`,
            style: snackbar.styles.warning,
          });
        } else {
          snackbar.setMessageState({
            open: true,
            text: 'Submission successful.',
            style: snackbar.styles.success,
          });
        }
      })
      .catch((e) => {
        snackbar.setMessageState({
          open: true,
          text: 'Submission failed due to exception: ' + e.message,
          style: snackbar.styles.warning,
        });
      });
  };
  return { submit: wrapDataFetcher, isLoading, data, error };
};

export default useDataSubmitter;
