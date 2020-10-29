import { useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import axios from 'axios';
import { isUndefined } from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
const reproject = require('reproject');
const epsg = require('epsg');

/**
 * Custom hook to fetch layer feature collection from wfs url
 * @param url wfs request url
 * @param minZoom minimum map zoom to trigger data fetch
 */
export const useLayer = (url: string, minZoom?: number): FeatureCollection | undefined => {
  const [data, setData] = useState<FeatureCollection>();
  const lastZoom = useSelector<RootState, number>(state => state.mapViewZoom);

  useEffect(() => {
    const load = async () => {
      const collection: FeatureCollection = (await axios.get(url)).data;
      if (collection.features.length !== 0) {
        setData(reproject.toWgs84(collection, undefined, epsg));
      }
    };

    if (isUndefined(minZoom) || lastZoom! >= minZoom) {
      load();
    }
  }, [url, minZoom, lastZoom]);

  return data;
};
