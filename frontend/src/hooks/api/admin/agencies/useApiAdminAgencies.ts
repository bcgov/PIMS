import { useApi } from 'hooks/api';
import React from 'react';

import { IAgencyModel } from '.';

export const useApiAdminAgencies = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      fetch: () => {
        return api.get<IAgencyModel>(`/admin/agencies`);
      },
    }),
    [api],
  );

  return controller;
};
