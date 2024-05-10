const urls = {
  GEOCODER: {
    HOSTURI: 'https://geocoder.api.gov.bc.ca',
    KEY: process.env.GEOCODER_KEY,
  },
  CHES: {
    AUTH: process.env.CHES_AUTH_URL,
    HOST: process.env.CHES_HOST_URL,
  },
};
export default urls;
