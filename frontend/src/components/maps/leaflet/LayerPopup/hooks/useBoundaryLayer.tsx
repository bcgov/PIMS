import { useEnvironment } from 'hooks/useEnvironment';

export const useBoundaryLayer = () => {
  const env = useEnvironment();

  let domain = '';
  switch (env.env) {
    case 'test':
      domain = `${env.env}.`;
      break;
    case 'development':
      domain = 'delivery.';
      break;
  }

  return `https://${domain}apps.gov.bc.ca/ext/sgw/geo.allgov?service=WFS&version=2.0&request=GetFeature&typeName=geo.allgov:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_FA_SVW&outputFormat=application/json`;
};
