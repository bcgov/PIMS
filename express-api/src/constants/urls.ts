const urls = {
  GEOCODER: {
    HOSTURI: 'https://geocoder.api.gov.bc.ca',
  },
  CHES: {
    AUTH: process.env.CHES_AUTH_URL,
    HOST: process.env.CHES_HOST_URI,
  },
  LTSA: {
    AUTHURL: 'https://appsuat.ltsa.ca/iam/api/auth/login/integrator',
    HOSTURI: 'https://tduat-x42b.ltsa.ca/titledirect/search/api/',
  },
};
export default urls;
