import { useApi } from 'hooks/api';
import React from 'react';

import { IGeoAddressModel, ISitePidsModel } from '.';

export const useApiGeocoder = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      findPids: async (guid: string) => {
        return api.get<ISitePidsModel>(`/tools/geocoder/parcels/pids/${guid}`);
      },
      findAddresses: async (address: string) => {
        return api.get<IGeoAddressModel[]>(`/tools/geocoder/addresses?address=${address}`);
      },
    }),
    [api],
  );

  return controller;
};
