import { useApi } from 'hooks/api';
import React from 'react';

import { IRoleModel } from '.';

export const useApiAdminRoles = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      fetch: () => {
        return api.get<IRoleModel>(`/admin/roles`);
      },
    }),
    [api],
  );

  return controller;
};
