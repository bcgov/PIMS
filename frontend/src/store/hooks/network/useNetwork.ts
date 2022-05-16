import { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { useNetworkStore } from 'store/slices/hooks';

export const useNetwork = () => {
  const network = useNetworkStore();

  const controller = React.useMemo(
    () => ({
      handleRequest: async (name: string, request: () => Promise<AxiosResponse>) => {
        try {
          network.storeRequest(name);
          const response = await request();
          network.storeSuccess(name, response.status);
          return response;
        } catch (error) {
          const ae = error as AxiosError;
          network.storeError(name, ae.response?.status, error);
        }
      },
      request: (name: string) => {
        network.storeRequest(name);
      },
      success: (name: string, status?: number) => {
        network.storeSuccess(name, status);
      },
      error: (name: string, status?: number, error?: any) => {
        network.storeError(name, status, error);
      },
      clear: (name: string) => {
        network.clearRequest(name);
      },
    }),
    [network],
  );
  return controller;
};
