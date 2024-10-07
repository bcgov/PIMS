import { IAddressModel } from '@/services/geocoder/interfaces/IAddressModel';
import { IFeatureCollectionModel } from '@/services/geocoder/interfaces/IFeatureCollectionModel';
import constants from '@/constants';
import { IFeatureModel } from '@/services/geocoder/interfaces/IFeatureModel';
import { getLongitude, getLatitude, getAddress1 } from './geocoderUtils';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

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
 * @throws ErrorWithCode if the response is not 200 OK
 */
export const getSiteAddresses = async (
  address: string,
  minScore: string = '0',
  maxResults: string = '1',
) => {
  const url = new URL('/addresses.json', constants.GEOCODER.HOSTURI);
  url.searchParams.append('addressString', address);
  url.searchParams.append('minScore', minScore);
  url.searchParams.append('maxResults', maxResults);
  url.searchParams.append('locationDescriptor', 'accessPoint');
  url.searchParams.append('setBack', '10');

  const response = await fetch(url.toString(), {
    headers: {
      apiKey: constants.GEOCODER.KEY,
    },
  });

  if (!response.ok) {
    throw new ErrorWithCode('Failed to fetch data', response.status);
  }

  const responseData = await response.json();
  const featureCollection: IFeatureCollectionModel = responseData;
  const addressInformation: IAddressModel[] = featureCollection.features.map((feature) =>
    mapFeatureToAddress(feature),
  );
  return addressInformation;
};

const geocoderService = {
  getSiteAddresses,
};

export default geocoderService;
