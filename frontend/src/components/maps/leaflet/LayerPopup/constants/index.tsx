import * as React from 'react';

export const MUNICIPALITY_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP';
export const PARCELS_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';

export const parcelLayerPopupConfig = {
  PARCEL_NAME: { label: 'Parcel Name:', display: (data: any) => data.PARCEL_NAME },
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
};

export const municipalityLayerPopupConfig = {
  ADMIN_AREA_GROUP_NAME: {
    label: 'Administration Area:',
    display: (data: any) => `${data.ADMIN_AREA_GROUP_NAME} (${data.CHANGE_REQUESTED_ORG})`,
  },
};
