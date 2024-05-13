import { FeatureCollection } from 'geojson';
import { IFetch } from '../useFetch';
import { LatLng } from 'leaflet';

export interface ParcelData {
  PARCEL_FABRIC_POLY_ID: number;
  PARCEL_NAME: string;
  PLAN_NUMBER: string;
  PIN: number;
  PID: string;
  PID_FORMATTED: string;
  PID_NUMBER: number;
  PARCEL_STATUS: string;
  PARCEL_CLASS: string;
  OWNER_TYPE: string;
  PARCEL_START_DATE: string;
  MUNICIPALITY: string;
  REGIONAL_DISTRICT: string;
  WHEN_UPDATED: string;
  FEATURE_AREA_SQM: number;
  FEATURE_LENGTH_M: number;
  OBJECTID: number;
  SE_ANNO_CAD_DATA: unknown;
}

const useParcelLayerApi = (absoluteFetch: IFetch) => {
  const getFeatureUrl =
    'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';

  const getParcelsByPid = async (pid: string) => {
    const formattedPid = pid.replace(/-/g, '');
    const finalUrl = `${getFeatureUrl}&srsName=EPSG:4326&CQL_FILTER=PID_NUMBER=${+formattedPid}`;
    const { parsedBody } = await absoluteFetch.get(finalUrl, {}, { headers: {} });
    return parsedBody as FeatureCollection;
  };

  const getParcelsByPin = async (pin: string) => {
    const formattedPin = pin.replace(/-/g, '');
    const finalUrl = `${getFeatureUrl}&srsName=EPSG:4326&CQL_FILTER=PIN=${+formattedPin}`;
    const { parsedBody } = await absoluteFetch.get(finalUrl, {}, { headers: {} });
    return parsedBody as FeatureCollection;
  };

  const getParcelsByLatLng = async (latlng: LatLng) => {
    const finalUrl = `${getFeatureUrl}&srsName=EPSG:4326&cql_filter=CONTAINS(SHAPE, SRID=4326;POINT ( ${latlng.lng} ${latlng.lat}))`;
    const { parsedBody } = await absoluteFetch.get(finalUrl, {}, { headers: {} });
    return parsedBody as FeatureCollection;
  };

  return {
    getParcelByPid: getParcelsByPid,
    getParcelByPin: getParcelsByPin,
    getParcelByLatLng: getParcelsByLatLng,
  };
};

export default useParcelLayerApi;
