export const MUNICIPALITY_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP';
export const PARCELS_LAYER_URL =
  'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';

export const parcelLayerPopupConfig = {
  PIN: { label: 'Parcel PIN:', display: (data: any) => data.PIN },
  PID: { label: 'Parcel PID:', display: (data: any) => data.PID },
  REGIONAL_DISTRICT: {
    label: 'Regional District:',
    display: (data: any) => data.REGIONAL_DISTRICT,
  },
};

export const municipalityLayerPopupConfig = {
  ADMIN_AREA_NAME: { label: 'Area Name:', display: (data: any) => data.ADMIN_AREA_NAME },
  ADMIN_AREA_ABBREVIATION: {
    label: 'Area Abbrevation:',
    display: (data: any) => data.ADMIN_AREA_ABBREVIATION,
  },
  ADMIN_AREA_GROUP_NAME: {
    label: 'Area Group Name:',
    display: (data: any) => `${data.ADMIN_AREA_GROUP_NAME} (${data.CHANGE_REQUESTED_ORG})`,
  },
};
