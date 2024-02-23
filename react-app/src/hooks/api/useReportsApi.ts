import { KeycloakUser } from '@bcgov/citz-imb-kc-react';
import { FetchResponse, IFetch } from '../useFetch';

export interface ErrorReport {
  user: KeycloakUser;
  userMessage: string;
  error: Error;
  timestamp: string;
}

const useReportsApi = (absoluteFetch: IFetch) => {
  const postErrorReport = async (error: ErrorReport): Promise<FetchResponse> => {
    return await absoluteFetch.post(`/reports/error`, error);
  };

  return {
    postErrorReport,
  };
};

export default useReportsApi;
