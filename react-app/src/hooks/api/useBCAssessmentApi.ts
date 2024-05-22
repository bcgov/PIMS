import { FeatureCollection } from 'geojson';
import { IFetch } from '../useFetch';

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

const useBCAssessmentApi = (absoluteFetch: IFetch) => {
  const prodURL =
    'https://apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';
  const testURL =
    'https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';

  const getBCAssessmentByLocation = async (lat: string, lng: string) => {
    const finalUrl = `${testURL}&CQL_FILTER=CONTAINS(SHAPE,SRID=4326;POINT(${lng},${lat}))`;
    const { parsedBody } = await absoluteFetch.get(
      finalUrl,
      {},
      {
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
    return parsedBody as FeatureCollection;
  };

  return {
    getBCAssessmentByLocation,
  };
};

export default useBCAssessmentApi;
