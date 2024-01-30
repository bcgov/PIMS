import { IAddressModel } from '@/services/geocoder/interfaces/IAddressModel';
//import { Request, Response } from 'express';
import { IFeatureCollectionModel } from '@/services/geocoder/interfaces/IFeatureCollectionModel';
import constants from '@/constants';
import { IFeatureModel } from '@/services/geocoder/interfaces/IFeatureModel';
import { getLongitude, getLatitude, getAddress1 } from './geocoderUtils';

const generateUrl = (endpoint: string, outputFormat = 'json'): string => {
  const host = constants.GEOCODER.HOSTURI;
  return `${host}${endpoint.replace('{outputFormat}', outputFormat)}`;
};

// const getSiteAddresses = async (
//   address: string,
//   outputFormat = 'json',
// ): Promise<FeatureCollectionModel> => {
//   const parameters = {
//     AddressString: address,
//   };
//   return getSiteAddressesAsync(parameters, outputFormat);
// };

const mapFeatureToAddress = (feature: IFeatureModel): IAddressModel => {
  return {
    siteId: feature.properties.siteID,
    fullAddress: feature.properties.fullAddress,
    address1: getAddress1(feature.properties),
    administrativeArea: feature.properties.localityName,
    provinceCode: feature.properties.provinceCode,
    longitude: getLongitude(feature.geometry),
    latitude: getLatitude(feature.geometry),
    score: feature.properties.score,
  };
};

export const getSiteAddressesAsync = async (): Promise<IAddressModel> =>
  //parameters: AddressesParameters,
  {
    // const queryString = new URLSearchParams(parameters).toString();
    try {
      const url = constants.GEOCODER.HOSTURI + '/addresses.json?addressString=525%20Superior';
      const response = await fetch(url, {
        headers: {
          apiKey: process.env.GEOCODER__KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();
      const featureCollection: IFeatureCollectionModel = responseData;
      const addressInformation: IAddressModel = mapFeatureToAddress(featureCollection.features[0]);
      console.log('generateUrl', generateUrl('addresses.json?addressString=525%20Superior'));
      console.log('test', addressInformation);
      return addressInformation;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

// const getPids = async (siteId: string, outputFormat = 'json'): Promise<SitePidsResponseModel> => {
//   const endpoint = options.parcels.pidsUrl.replace('{siteId}', siteId);
//   const url = generateUrl(endpoint, outputFormat);
//   const response = await fetch(url);
//   return await response.json();
// };

export const GeocoderService = {
  generateUrl,
  // getSiteAddresses,
  getSiteAddressesAsync,
  // getPids,
};
