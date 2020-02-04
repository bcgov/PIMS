// Network URL's
import queryString from "query-string";

// Properties
export interface PropertyListParams {
  neLat: number,
  neLong: number,
  swLat: number,
  swLong: number
}
export const PROPERTIES = (params: PropertyListParams) => (params ? `/properties?${queryString.stringify(params)}` : "/properties"); // get filtered properties or all if not specified.

export interface PropertyDetailParams {
  pid: number
}
export const PROPERTYDETAIL = (params: PropertyDetailParams) => (`/properties/${params.pid}`);