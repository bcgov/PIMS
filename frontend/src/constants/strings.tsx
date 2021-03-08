// reusable messages for error handling, validations, null-screens, etc.
export const ERROR = 'Error.';
export const ERROR_CANCELED =
  "Can't complete this request. Please notify mds@gov.bc.ca if this problem persists.";
export const LOADING = 'Loading...';
export const TRY_AGAIN = 'Please try again later';
export const NO_DATA = 'No data available';
export const MAP_UNAVAILABLE = [
  'The BC Geographic Warehouse (BCGW) map layers used in this application are unavailable at this time.',
  'Please notify ',
  'pims@gov.bc.ca',
  ' if this problem persists.',
];
export const MAP_UNAVAILABLE_STR = MAP_UNAVAILABLE.join('\n');
export const QUERY_MAP = 'Querying BC Geographic Warehouse (BCGW) map layer';

export const UNAUTHORIZED = 'You do not have permission to access this site';
export const UNAUTHORIZED_PAGE = 'You do not have permission to access this page';

export const EMPTY_FIELD = 'N/A';
export const EMPTY = '';
export const ZERO = '0';
export const UNASSIGNED = 'Unassigned';

// default coordinates for center of BC
export const DEFAULT_LAT = 53.7267;
export const DEFAULT_LONG = -127.6476;
export const DEFAULT_ZOOM = 6;
export const HIGH_ZOOM = 14;

// max zoom level when clicking on parcel/building pins
export const MAX_ZOOM = 16;

// default url values
export const DEFAULT_PAGE = '1';
export const DEFAULT_PER_PAGE = '25';
export const DEFAULT_DASHBOARD_PARAMS = '?page=1&per_page=25';

// Global
export const DISCLAIMER_URL = 'https://www2.gov.bc.ca//gov/content/home/disclaimer';
export const PRIVACY_POLICY_URL = 'http://www.gov.bc.ca/gov/content/home/privacy';
export const HARMFUL_DISCLOSURE_URL =
  'https://www2.gov.bc.ca/gov/content/governments/services-for-government/policies-procedures/foippa-manual/disclosure-harmful-individual-public-safety';
export const AUTHORIZATION_URL = 'https://github.com/bcgov/PIMS/wiki/Architecture-Security';
export const INVENTORY_POLICY_URL =
  'https://www2.gov.bc.ca/gov/content/governments/services-for-government/real-estate-space/asset-management-services/inventory-policy';
