/**
 * Some of these can probably be separated out elsewhere later, but I think this is fine for now.
 * Was uncertain whether ISubdivision or ISubParcel are meant to be just a selection from IParcel or their own interfaces.
 */

interface IAddress {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  line1: string;
  line2: string;
  administrativeArea: string;
  provinceId: string;
  province: string;
  postal: string;
}

interface IEvaluation {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  parcelId: number;
  date: string;
  key: string;
  value: number;
  note: string;
  firm: string;
}

interface IFiscal {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  parcelId: number;
  fiscalYear: number;
  effectiveDate: string;
  key: string;
  value: number;
  note: string;
}

interface IBuilding {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  propertyTypeId: number;
  projectNumbers: string[];
  projectWorkflow: string;
  projectStatus: string;
  name: string;
  description: string;
  classificationId: number;
  classification: string;
  encumbranceReason: string;
  agencyId: number;
  subAgency: string;
  agency: string;
  subAgencyFullName: string;
  agencyFullName: string;
  address: IAddress;
  latitude: number;
  longitude: number;
  isSensitive: boolean;
  isVisibleToOtherAgencies: boolean;
  parcelId: number;
  buildingConstructionTypeId: number;
  buildingConstructionType: string;
  buildingFloorCount: number;
  buildingPredominateUseId: number;
  buildingPredominateUse: string;
  buildingOccupantTypeId: number;
  buildingOccupantType: string;
  leaseExpiry: string;
  occupantName: string;
  transferLeaseOnSale: boolean;
  buildingTenancy: string;
  rentableArea: number;
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
}

interface ISubParcel {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  pid: string;
  pin: number;
}

interface ISubdivision {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  pid: string;
  pin: number;
}

interface IParcel {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  rowVersion: string;
  id: number;
  propertyTypeId: number;
  projectNumbers: string[];
  projectWorkflow: string;
  projectStatus: string;
  name: string;
  description: string;
  classificationId: number;
  classification: string;
  encumbranceReason: string;
  agencyId: number;
  subAgency: string;
  agency: string;
  subAgencyFullName: string;
  agencyFullName: string;
  address: IAddress;
  latitude: number;
  longitude: number;
  isSensitive: boolean;
  isVisibleToOtherAgencies: boolean;
  pid: string;
  pin: number;
  landArea: number;
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
  buildings: IBuilding[];
  parcels: ISubParcel[];
  subdivisions: ISubdivision[];
}

export { IParcel };
