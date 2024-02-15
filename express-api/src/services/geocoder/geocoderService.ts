import { IAddressModel } from '@/services/geocoder/interfaces/IAddressModel';
//import { Request, Response } from 'express';
import { IFeatureCollectionModel } from '@/services/geocoder/interfaces/IFeatureCollectionModel';
import constants from '@/constants';
import { IFeatureModel } from '@/services/geocoder/interfaces/IFeatureModel';
import { getLongitude, getLatitude, getAddress1 } from './geocoderUtils';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { ISitePidsResponseModel } from './interfaces/ISitePidsResponseModel';


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

/**
 * @description Sends a request to Geocoder for addresses that match the specified 'address'.
 * @param address String of searchable address. eg. "4000 Seymour St Victoria BC"
 * @returns address information matching IAddressModel format
 * @throws ErrorWithCode if an error is caught 
 */
export const getSiteAddressesAsync = async (address: string) => {
  const url = new URL('/addresses.json', constants.GEOCODER.HOSTURI);
  url.searchParams.append('addressString', address);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        apiKey: process.env.GEOCODER__KEY,
      },
    });

    if (!response.ok) {
      throw new ErrorWithCode('Failed to fetch data', response.status);
    };

    const responseData = await response.json();
    const featureCollection: IFeatureCollectionModel = responseData;
    const addressInformation: IAddressModel = mapFeatureToAddress(featureCollection.features[0]);

    return addressInformation;

  } catch (error) {
    throw new ErrorWithCode(error.message, error.status);
  };
};

/**
 * @description Sends a request to Geocoder for all parcel identifiers (PIDs) associated with an individual site.
 * @param siteId a unique identifier assigned to every site in B.C.
 * @returns Valid 'siteId' values for an address
 * @throws ErrorWithCode if result is not 200 OK
 */
const getPids = async (siteId: string) => {
  // essentially what we want is this
  const url = new URL('/parcels/pids/'.concat(siteId).concat('.json'), constants.GEOCODER.HOSTURI);
  const result = await fetch(url.toString(), {
    headers: {
      apiKey: process.env.GEOCODER_KEY,
    },
  });

  if (result.status != 200){
    throw new ErrorWithCode(result.statusText, result.status);
  };

  const resultData = await result.json()
  const pidInformation: ISitePidsResponseModel = resultData;
  return pidInformation;
};

export const GeocoderService = {
  getSiteAddressesAsync,
  getPids,
};
