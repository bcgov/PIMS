import {
  IProperty,
  IParcel,
  IAddress,
  IBuilding,
  IEvaluation,
  IFiscal,
} from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/index';

export const mockProperty: IProperty = {
  id: 1,
  propertyTypeId: PropertyTypes.PARCEL,
  agencyId: 1,
  agency: 'agency',
  subAgency: 'subagency',
  agencyFullName: 'agency full name',
  subAgencyFullName: 'subagency full name',
  latitude: 0.31,
  longitude: 1.34,
  name: 'name',
  description: 'description',
  projectNumbers: ['SPP-1233'],
  projectStatus: 'status',
  projectWorkflow: 'workflow',
  isSensitive: false,
  createdOn: Date.UTC.toString(),
  updatedOn: Date.UTC.toString(),
  updatedByEmail: 'john.doe@email.com',
  updatedByName: 'John Doe',
};

export const mockAddress: IAddress = {
  line1: '1234 Some Street',
  administrativeArea: 'administrative area',
  provinceId: 'BC',
  postal: 'V9V 3I3',
};

export const mockEvaluation: IEvaluation = {
  key: 'Assessed',
  value: 1000.23,
};

export const mockFiscal: IFiscal = {
  key: 'Appraised',
  value: 333.21,
};

export const mockBuilding: IBuilding = {
  ...mockProperty,
  parcelId: 1,
  pid: 12333,
  address: mockAddress,
  buildingConstructionTypeId: 1,
  buildingPredominateUseId: 1,
  buildingOccupantTypeId: 1,
  classificationId: 1,
  classification: 'classification',
  encumbranceReason: 'encumbranceReason',
  occupantName: 'occupantName',
  transferLeaseOnSale: false,
  buildingTenancy: 'buildingTenancy',
  rentableArea: 234,
  totalArea: 500,
  agencyCode: 'agencyCode',
  assessedLand: 3434.23,
  assessedBuilding: 34343.34,
  evaluations: [mockEvaluation],
  fiscals: [mockFiscal],
  parcels: [],
};

export const mockParcel: IParcel = {
  ...mockProperty,
  pid: '133-123-123',
  pin: '',
  classification: 'classification',
  classificationId: 1,
  encumbranceReason: 'encumbranceReason',
  address: mockAddress,
  landArea: 235,
  landLegalDescription: 'landLegalDescription',
  zoning: 'zoning',
  zoningPotential: 'zoningPotential',
  buildings: [mockBuilding],
  parcels: [],
  assessedLand: 12313.12,
  assessedBuilding: 2432.23,
  evaluations: [mockEvaluation],
  fiscals: [mockFiscal],
  rowVersion: 'version',
};
