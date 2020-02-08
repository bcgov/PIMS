// Network URL's
import queryString from "query-string";

// Parcels
export interface IParcelListParams {
  neLat: number,
  neLong: number,
  swLat: number,
  swLong: number
}
export const PARCELS = (params: IParcelListParams) => (params ? `/my/parcel?${queryString.stringify(params)}` : "/my/parcel"); // get filtered properties or all if not specified.

export interface IParcelDetailParams {
  pid: number
}
export const PARCELDETAIL = (params: IParcelDetailParams) => (`/my/parcel/${params.pid}`);