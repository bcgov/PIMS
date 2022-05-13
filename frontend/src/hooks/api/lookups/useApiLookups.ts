import React from 'react';

import { useApi } from 'hooks/api';
import { ILookupModel } from '.';

export const useApiLookups = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      fetch: async () => {
        return api.get<ILookupModel[]>('/api/lookup/all');
      },
    }),
    [api],
  );

  return controller;
};
