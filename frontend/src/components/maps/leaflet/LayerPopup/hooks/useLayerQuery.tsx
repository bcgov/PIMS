import { FeatureCollection } from 'geojson';
import axios from 'axios';
import { LatLng } from 'leaflet';
import { useCallback } from 'react';

interface IUserLayerQuery {
  /**
   * function to find GeoJSON shape containing a point (x, y)
   * @param latlng = {lat, lng}
   */
  findOneWhereContains: (latlng: LatLng) => Promise<FeatureCollection>;
}

/**
 * Custom hook to fetch layer feature collection from wfs url
 * @param url wfs request url
 * @param geometry the name of the geometry in the feature collection
 */
export const useLayerQuery = (url: string, geometryName: string = 'SHAPE'): IUserLayerQuery => {
  const findOneWhereContains = useCallback(
    async (latlng: LatLng): Promise<FeatureCollection> => {
      const data: FeatureCollection = (
        await axios.get(
          `${url}&count=1&cql_filter=CONTAINS(${geometryName}, SRID=4326;POINT ( ${latlng.lng} ${latlng.lat}))`,
        )
      ).data;
      return data;
    },
    [url, geometryName],
  );

  return { findOneWhereContains };
};
