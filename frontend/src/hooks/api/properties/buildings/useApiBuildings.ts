import { useApi } from 'hooks/api';
import React from 'react';

import { IBuildingModel } from '.';

export const useApiBuildings = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      get: (id: number) => {
        return api.get<IBuildingModel>(`/api/properties/buildings/${id}`);
      },
      add: (model: IBuildingModel) => {
        return api.post<IBuildingModel>(`/api/properties/buildings`, model);
      },
      update: (model: IBuildingModel) => {
        return api.put<IBuildingModel>(`/api/properties/buildings/${model.id}`, model);
      },
      updateFinancials: (model: IBuildingModel) => {
        return api.put<IBuildingModel>(`/api/properties/buildings/${model.id}/financials`, model);
      },
      remove: (model: IBuildingModel) => {
        return api.delete<IBuildingModel>(`/api/properties/buildings/${model.id}`, { data: model });
      },
    }),
    [api],
  );

  return controller;
};
