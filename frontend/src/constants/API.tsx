// Network URL's
import queryString from "query-string";

// Parcels
export interface ParcelListParams {
  neLat: number,
  neLong: number,
  swLat: number,
  swLong: number
}
export const PARCELS = (params: ParcelListParams) => (params ? `/my/parcel?${queryString.stringify(params)}` : "/properties"); // get filtered properties or all if not specified.

export interface ParcelDetailParams {
  pid: number
}
export const PARCELDETAIL = (params: ParcelDetailParams) => (`/my/parcel/${params.pid}`);