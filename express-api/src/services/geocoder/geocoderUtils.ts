/**
 * geocoderUtils.ts - Utility functions for working with geocoding data
 */

import { IPropertyModel } from '@/services/geocoder/interfaces/IPropertyModel';
import { IGeometryModel } from '@/services/geocoder/interfaces/IGeometryModel';
import { IFeatureModel } from '@/services/geocoder/interfaces/IFeatureModel';
import { IAddressModel } from '@/services/geocoder/interfaces/IAddressModel';

/**
 * Constructs address string based on property data.
 * @param properties - The property data.
 * @returns The constructed address string.
 */
export const getAddress1 = (properties: IPropertyModel): string => {
  const address = [];

  if (properties.civicNumber) address.push(properties.civicNumber);

  if (properties.isStreetTypePrefix == 'true' && properties.streetType)
    address.push(properties.streetType);

  if (properties.isStreetDirectionPrefix == 'true' && properties.streetDirection)
    address.push(properties.streetDirection);

  if (properties.streetName) address.push(properties.streetName);

  if (properties.isStreetTypePrefix != 'true' && properties.streetType)
    address.push(properties.streetType);

  if (properties.streetQualifier) address.push(properties.streetQualifier);

  if (properties.isStreetDirectionPrefix != 'true' && properties.streetDirection)
    address.push(properties.streetDirection);

  return address.join(' ');
};

/**
 * Retrieves latitude from geometry data.
 * @param geometry - The geometry data.
 * @returns The latitude value.
 */
export const getLatitude = (geometry: IGeometryModel): number => {
  if (geometry.coordinates && geometry.coordinates.length === 2) {
    return geometry.coordinates[1];
  }
  return 0;
};

/**
 * Retrieves longitude from geometry data.
 * @param geometry - The geometry data.
 * @returns The longitude value.
 */
export const getLongitude = (geometry: IGeometryModel): number => {
  if (geometry.coordinates && geometry.coordinates.length === 2) {
    return geometry.coordinates[0];
  }
  return 0;
};

/**
 * Maps feature data to address data.
 * @param feature - The feature data.
 * @returns The mapped address data.
 */
export const mapFeatureToAddress = (feature: IFeatureModel): IAddressModel => {
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
