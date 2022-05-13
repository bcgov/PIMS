import { useApi } from 'hooks/api';
import React from 'react';

import { IClaimModel } from '.';

export const useApiAdminClaims = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      fetch: () => {
        return api.get<IClaimModel>(`/admin/claims`);
      },
    }),
    [api],
  );

  return controller;
};
