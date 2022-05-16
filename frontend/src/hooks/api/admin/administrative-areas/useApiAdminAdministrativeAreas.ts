import { IPageModel, useApi } from 'hooks/api';
import React from 'react';

import { IAdministrativeAreaFilter, IAdministrativeAreaModel } from '.';

export const useApiAdminAdministrativeAreas = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      fetch: () => {
        return api.get<IAdministrativeAreaModel>(`/admin/administrative/areas`);
      },
      find: (filter: IAdministrativeAreaFilter) => {
        return api.post<IPageModel<IAdministrativeAreaModel>>(
          `/admin/administrative/areas`,
          filter,
        );
      },
      get: (id: number) => {
        return api.get<IAdministrativeAreaModel>(`/admin/administrative/areas/${id}`);
      },
      add: (model: IAdministrativeAreaModel) => {
        return api.post<IAdministrativeAreaModel>(`/admin/administrative/areas`, model);
      },
      update: (model: IAdministrativeAreaModel) => {
        return api.put<IAdministrativeAreaModel>(`/admin/administrative/areas/${model.id}`, model);
      },
      remove: (model: IAdministrativeAreaModel) => {
        return api.delete<IAdministrativeAreaModel>(`/admin/administrative/areas/${model.id}`, {
          data: model,
        });
      },
    }),
    [api],
  );

  return controller;
};
