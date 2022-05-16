import { useApi } from 'hooks/api';
import React from 'react';

import { IUserActivateModel, IUserInfoModel } from '.';

export const useApiUsers = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      userInfo: () => {
        return api.get<IUserInfoModel>(`/users/info`);
      },
      activate: () => {
        return api.post<IUserActivateModel>(`/auth/activate`);
      },
    }),
    [api],
  );

  return controller;
};
