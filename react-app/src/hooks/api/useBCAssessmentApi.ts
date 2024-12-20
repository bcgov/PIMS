import { IFetch } from '@/hooks/useFetch';
import { BBox, FeatureCollection, Geometry } from 'geojson';

export interface BCAssessmentProperties {
  BCA_FGPV_SYSID: number;
  ROLL_NUMBER: string;
  FOLIO_ID: string;
  FOLIO_STATUS: string;
  FOLIO_STATUS_DESCRIPTION: string;
  GEN_VALUES_COUNT: number;
  GEN_GROSS_IMPROVEMENT_VALUE: number;
  GEN_GROSS_LAND_VALUE: number;
  GEN_NET_IMPROVEMENT_VALUE: number;
  GEN_NET_LAND_VALUE: number;
  GEN_TXXMT_IMPROVEMENT_VALUE: number | null;
  GEN_TXXMT_LAND_VALUE: number | null;
  GEN_PROPERTY_CLASS_CODE: string;
  GEN_PROPERTY_CLASS_DESC: string;
  GEN_PROPERTY_SUBCLASS_CODE: string;
  GEN_PROPERTY_SUBCLASS_DESC: string;
  JURISDICTION_CODE: string;
  JURISDICTION: string;
  WHEN_CREATED: Date;
  WHEN_UPDATED: Date | null;
  EXPIRY_DATE: string | null;
  FEATURE_AREA_SQM: number;
  FEATURE_LENGTH_M: number;
  OBJECTID: number;
  SE_ANNO_CAD_DATA: null; // what is this when not null?
  bbox: BBox;
}

export interface JurRollPidXref {
  PID: number;
  JurisdictionCode: string;
  RollNumber: string;
}

const useBCAssessmentApi = (absoluteFetch: IFetch) => {
  const url = window.location.href.includes('pims.gov.bc.ca')
    ? 'https://apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json'
    : 'https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';

  const getBCAssessmentByLocation = async (lng: number, lat: number) => {
    const finalUrl = `${url}&srsName=EPSG:4326&CQL_FILTER=CONTAINS(SHAPE,SRID=4326;POINT(${lng} ${lat}))`;
    const response = await fetch(finalUrl, {
      credentials: 'include',
    });
    if (!response.ok) return;
    const body = await response.json();
    return body as FeatureCollection<Geometry, BCAssessmentProperties>;
  };

  const getJurisdictionRoleByPid = async (pid: number) => {
    const response = await absoluteFetch.get(`/tools/jur-roll-xref?pid=${pid}`);
    return response;
  };

  return {
    getBCAssessmentByLocation,
    getJurisdictionRoleByPid,
  };
};

export default useBCAssessmentApi;
