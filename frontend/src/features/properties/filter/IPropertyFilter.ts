/**
 * Property filter options used by Formik.
 */
export interface IPropertyFilter {
  /** Select one of the search options [address, pid, projectNumber, location]. */
  searchBy: string;
  /** The page number. */
  page?: string;
  /** The quantity to return in a single request for paging. */
  quantity?: string;
  /** The unique PID of the parcel. */
  pid: string;
  /** The address of the property. */
  address: string;
  /** The location of the property. */
  administrativeArea: string;
  /** The project number the property is part of. */
  projectNumber: string;
  /** comma-separated list of agencies to filter by */
  agencies: string;
  /** The classification of the property. */
  classificationId: string;
  /** The minimum lot size of the property. */
  minLotSize: string;
  /** The maxium lot size of the property. */
  maxLotSize: string;
  /** Whether the property is in SPP. */
  inSurplusPropertyProgram?: string;
  /** Whether the property is in ERP. */
  inEnhancedReferralProcess?: string;
  /** Select on of the property types [Land, Building]. */
  propertyType?: string;
}
