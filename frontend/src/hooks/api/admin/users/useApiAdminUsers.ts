import { useApi } from 'hooks/api';
import React from 'react';

import { IUserModel } from '.';

export const useApiAdminUsers = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      fetch: () => {
        return api.get<IUserModel>(`/admin/users`);
      },
    }),
    [api],
  );

  return controller;
};
