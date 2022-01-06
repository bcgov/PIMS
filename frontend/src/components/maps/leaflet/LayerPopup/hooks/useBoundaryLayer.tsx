import { useEnvironment } from 'hooks/useEnvironment';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

export const Username = () => {
  const keycloak = useKeycloakWrapper();
  return keycloak.username;
};

export const FindUserType = (username: string) => {
  let isIDIRUser = username.includes('idir');
  let isBCeIDUser = username.includes('bceid');

  if (isIDIRUser) {
    return 'idir';
  } else if (isBCeIDUser) {
    return 'bceid';
  }
};

export const useBoundaryLayer = () => {
  const env = useEnvironment();
  const username = Username();
  const userType = FindUserType(username);

  let domain = '';
  let parcelURL = '';
  switch (env.env) {
    case 'test':
      domain = `${env.env}.`;
      break;
    case 'development':
      domain = 'delivery.';
      break;
  }
  switch (userType) {
    case 'idir':
      parcelURL =
        'apps.gov.bc.ca/ext/sgw/geo.allgov?service=WFS&version=2.0&request=GetFeature&typeName=geo.allgov:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_FA_SVW&outputFormat=application/json';
      break;
    case 'bceid':
      parcelURL =
        'openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';
      break;
    default:
      parcelURL =
        'openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';
      break;
  }

  return `https://${domain}${parcelURL}`;
};
