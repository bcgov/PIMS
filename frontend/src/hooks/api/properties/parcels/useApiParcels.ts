import { IParcelFilter, useApi } from 'hooks/api';
import React from 'react';

import { IParcelModel, IPidAvailableModel, IPinAvailableModel } from '.';

export const useApiParcels = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      get: (id: number) => {
        return api.get<IParcelModel>(`/api/properties/parcels/${id}`);
      },
      find: (filter: IParcelFilter) => {
        return api.post<IParcelModel[]>(`/api/properties/parcels/filter`, filter);
      },
      isPidAvailable: (parcelId: number, pid: number) => {
        return api.get<IPidAvailableModel>(
          `/api/properties/parcels/check/pid-available?parcelId=${parcelId}&pid=${pid}`,
        );
      },
      isPinAvailable: (parcelId: number, pin: number) => {
        return api.get<IPinAvailableModel>(
          `/api/properties/parcels/check/pin-available?parcelId=${parcelId}&pin=${pin}`,
        );
      },
      add: (model: IParcelModel) => {
        return api.post<IParcelModel>(`/api/properties/parcels`, model);
      },
      update: (model: IParcelModel) => {
        return api.put<IParcelModel>(`/api/properties/parcels/${model.id}`, model);
      },
      updateFinancials: (model: IParcelModel) => {
        return api.put(`/api/properties/parcels/${model.id}/financials`, model);
      },
      remove: (model: IParcelModel) => {
        return api.delete<IParcelModel>(`/api/properties/parcels/${model.id}`, { data: model });
      },
    }),
    [api],
  );

  return controller;
};
