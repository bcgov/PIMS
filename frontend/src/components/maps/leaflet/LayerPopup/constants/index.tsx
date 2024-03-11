import * as React from 'react';

export const MUNICIPALITY_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP';
export const PARCELS_PUBLIC_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';
export const BCA_PRIVATE_LAYER_URL =
  'https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';

export const parcelLayerPopupConfig = {
  PARCEL_NAME: { label: 'Parcel Name:', display: (data: any) => data.PARCEL_NAME },
  LEGAL_DESCRIPTION: {
    label: 'Legal Description:',
    display: (data: any) => data.LEGAL_DESCRIPTION,
  },
  SURVEY_DESIGNATION_1: {
    label: 'Survey Designation:',
    display: (data: any) => data.SURVEY_DESIGNATION_1,
  },
  PIN: { label: 'Parcel PIN:', display: (data: any) => data.PIN },
  PID: { label: 'Parcel PID:', display: (data: any) => data.PID },
  PLAN_NUMBER: { label: 'Plan Number:', display: (data: any) => data.PLAN_NUMBER },
  PARCEL_CLASS: { label: 'Parcel Class:', display: (data: any) => data.PARCEL_CLASS },
  MUNICIPALITY: { label: 'Municipality:', display: (data: any) => data.MUNICIPALITY },
  REGIONAL_DISTRICT: {
    label: 'Regional District:',
    display: (data: any) => data.REGIONAL_DISTRICT,
  },
  FEATURE_AREA_SQM: {
    label: 'Area:',
    display: (data: any) => (
      <>
        {data.FEATURE_AREA_SQM} m<sup>2</sup>
      </>
    ),
  },
  GEN_GROSS_LAND_VALUE: {
    label: 'Gross Land Value:',
    display: (data: any) => (
      <>{data.GEN_GROSS_LAND_VALUE ? `$${data.GEN_GROSS_LAND_VALUE}` : `N/A`}</>
    ),
  },
  GEN_GROSS_IMPROVEMENT_VALUE: {
    label: 'Gross Improvement Value:',
    display: (data: any) => (
      <>{data.GEN_GROSS_IMPROVEMENT_VALUE ? `$${data.GEN_GROSS_IMPROVEMENT_VALUE}` : `N/A`}</>
    ),
  },
  GEN_NET_LAND_VALUE: {
    label: 'Net Land Value:',
    display: (data: any) => <>{data.GEN_NET_LAND_VALUE ? `$${data.GEN_NET_LAND_VALUE}` : `N/A`}</>,
  },
  GEN_NET_IMPROVEMENT_VALUE: {
    label: 'Net Improvement Value:',
    display: (data: any) => (
      <>{data.GEN_NET_IMPROVEMENT_VALUE ? `$${data.GEN_NET_IMPROVEMENT_VALUE}` : `N/A`}</>
    ),
  },
  FOLIO_ID: {
    label: 'Folio ID:',
    display: (data: any) => <>{data.FOLIO_ID ? `${data.FOLIO_ID}` : `N/A`}</>,
  },
};

export const municipalityLayerPopupConfig = {
  ADMIN_AREA_GROUP_NAME: {
    label: 'Administration Area:',
    display: (data: any) => `${data.ADMIN_AREA_GROUP_NAME} (${data.CHANGE_REQUESTED_ORG})`,
  },
};
