import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import axios from 'axios';
import { LatLng, geoJSON } from 'leaflet';
import { useCallback, Dispatch } from 'react';
import parcelLayerDataSlice, { saveParcelLayerData } from 'reducers/parcelLayerDataSlice';
import { error } from 'actions/genericActions';
import { toast } from 'react-toastify';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { useDispatch } from 'react-redux';

interface IUserLayerQuery {
  /**
   * function to find GeoJSON shape containing a point (x, y)
   * @param latlng = {lat, lng}
   */
  findOneWhereContains: (latlng: LatLng) => Promise<FeatureCollection>;
  /**
   * function to find GeoJSON shape matching the passed non-zero padded pid.
   * @param pid
   */
  findByPid: (pid: string) => Promise<FeatureCollection>;
  /**
   * function to find GeoJSON shape matching the passed pin.
   * @param pin
   */
  findByPin: (pin: string) => Promise<FeatureCollection>;
}

/**
 * Save the parcel data layer response to redux for use within other components. Also save an entire copy of the feature for display on the map.
 * @param resp
 * @param dispatch
 */
export const saveParcelDataLayerResponse = (
  resp: FeatureCollection<Geometry, GeoJsonProperties>,
  dispatch: Dispatch<any>,
  latLng?: LatLng,
) => {
  if (resp?.features?.length > 0) {
    //save with a synthetic event to timestamp the relevance of this data.
    dispatch(
      saveParcelLayerData({
        e: { timeStamp: document?.timeline?.currentTime ?? 0 } as any,
        data: {
          ...resp.features[0].properties!,
          CENTER:
            latLng ??
            geoJSON(resp.features[0].geometry)
              .getBounds()
              .getCenter(),
        },
      }),
    );
  } else {
    toast.warning(`Failed to find parcel layer data. Ensure that the search criteria is valid`);
  }
};

/**
 * Standard logic to handle a parcel layer data response, independent of whether this is a lat/lng or pid query response.
 * @param response axios response
 * @param dispatch redux store, required to save results.
 */
export const handleParcelDataLayerResponse = (
  response: Promise<FeatureCollection<Geometry, GeoJsonProperties>>,
  dispatch: Dispatch<any>,
  latLng?: LatLng,
) => {
  return response
    .then((resp: FeatureCollection<Geometry, GeoJsonProperties>) => {
      saveParcelDataLayerResponse(resp, dispatch, latLng);
    })
    .catch((axiosError: any) => {
      dispatch(error(parcelLayerDataSlice.reducer.name, axiosError?.response?.status, axiosError));
    });
};

/**
 * Custom hook to fetch layer feature collection from wfs url
 * @param url wfs request url
 * @param geometry the name of the geometry in the feature collection
 */
export const useLayerQuery = (url: string, geometryName: string = 'SHAPE'): IUserLayerQuery => {
  const instance = axios.create();
  const dispatch = useDispatch();

  instance &&
    instance.interceptors.request.use(
      config => {
        dispatch(showLoading());
        return config;
      },
      error => {
        dispatch(hideLoading());
        return Promise.reject(error);
      },
    );

  instance &&
    instance.interceptors.response.use(
      config => {
        dispatch(hideLoading());
        return config;
      },
      error => {
        dispatch(hideLoading());
        return Promise.reject(error);
      },
    );

  const baseUrl = `${url}&srsName=EPSG:4326&count=1`;
  const findOneWhereContains = useCallback(
    async (latlng: LatLng): Promise<FeatureCollection> => {
      const data: FeatureCollection = (
        await instance.get(
          `${baseUrl}&cql_filter=CONTAINS(${geometryName},SRID=4326;POINT ( ${latlng.lng} ${latlng.lat}))`,
        )
      ).data;
      return data;
    },
    [baseUrl, geometryName, instance],
  );
  const findByPid = useCallback(
    async (pid: string): Promise<FeatureCollection> => {
      //Do not make a request if we our currently cached response matches the requested pid.
      const formattedPid = pid.replace(/-/g, '');
      if (isNaN(+formattedPid)) {
        return { features: [], type: 'FeatureCollection' };
      }
      const data: FeatureCollection = (
        await instance.get(`${baseUrl}&CQL_FILTER=PID_NUMBER=${+formattedPid}`)
      ).data;
      return data;
    },
    [baseUrl, instance],
  );

  const findByPin = useCallback(
    async (pin: string): Promise<FeatureCollection> => {
      //Do not make a request if we our currently cached response matches the requested pid.
      const data: FeatureCollection = (await instance.get(`${baseUrl}&CQL_FILTER=PIN=${pin}`)).data;
      return data;
    },
    [baseUrl, instance],
  );

  return { findOneWhereContains, findByPid, findByPin };
};
