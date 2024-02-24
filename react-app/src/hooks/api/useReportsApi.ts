import { KeycloakUser } from '@bcgov/citz-imb-kc-react';
import { FetchResponse, IFetch } from '../useFetch';

export interface ErrorReport {
  user: KeycloakUser;
  userMessage: string;
  error: {
    message: string;
    stack: string;
  };
  timestamp: string;
}

const useReportsApi = (absoluteFetch: IFetch) => {
  const postErrorReport = async (error: ErrorReport): Promise<FetchResponse> => {
    // Specified url base because this call is outside of the ConfigContext
    const response = await absoluteFetch.post(`/api/v2/reports/error`, error);
    return response;
  };

  return {
    postErrorReport,
  };
};

export default useReportsApi;
