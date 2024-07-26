import { SSOUser } from '@bcgov/citz-imb-sso-react';
import { FetchResponse, IFetch } from '../useFetch';

export interface ErrorReport {
  user: SSOUser;
  userMessage: string;
  error: {
    message: string;
    stack: string;
  };
  timestamp: string;
  url: string;
}

const useReportsApi = (absoluteFetch: IFetch) => {
  const postErrorReport = async (error: ErrorReport): Promise<FetchResponse> => {
    const response = await absoluteFetch.post(`/reports/error`, error);
    return response;
  };

  return {
    postErrorReport,
  };
};

export default useReportsApi;
