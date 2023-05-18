import Axios from 'axios';
import { FeatureCollection } from 'geojson';
import { useApi } from 'hooks/api';
import React from 'react';

import { IGeoAddressModel, ISitePidsModel } from '.';

/**
 * Provides a simple api to communicate with geocoder endpoints.
 * @returns API controller with endpoints to Geocoder.
 */
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
      addresses: async (address: string, bbox?: string, locality?: string) => {
        const axios = Axios.create({
          baseURL: 'https://geocoder.api.gov.bc.ca',
        });
        // TODO: Figure out how to only return good results, Geocoder returns a ton of junk.
        const params: any = {
          ver: '1.2',
          addressString: `"${address}"`,
          outputSRS: 4326,
          // maxResults: 10,
          minScore: 60,
          setBack: 0,
          echo: true,
          brief: true,
          autoComplete: true,
          locationDescriptor: 'parcelPoint',
          // interpolation: 'adaptive',
          // matchPrecision: 'CIVIC_NUMBER,STREET',
          provinceCode: 'BC',
        };
        if (!!locality) params.localities = locality;
        if (!!bbox) {
          const values = bbox.split(',');
          params.bbox = `${values[0]},${values[2]},${values[1]},${values[3]}`;
        }
        return axios.get<FeatureCollection>(`/addresses.json`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
          params,
        });
      },
    }),
    [api],
  );

  return controller;
};
