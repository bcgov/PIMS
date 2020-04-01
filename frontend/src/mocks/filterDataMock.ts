import { ILookupCode } from '../actions/lookupActions';
import { IParcelDetail, IParcel } from 'actions/parcelsActions';
import { MapFilterModel } from 'components/maps/leaflet/Map';

export const SELECTEDCLASSIFICATION = {
  name: 'Core Operational',
  id: 0,
  isDisabled: false,
  type: 'Classification',
};

export const DISABLED = [
  {
    name: 'Core Operational',
    id: 0,
    isDisabled: false,
    type: 'Classification',
  },
  {
    name: 'Core Strategic',
    id: 1,
    isDisabled: true,
    type: 'Classification',
  },
];

export const CLASSIFICATIONS = [
  {
    name: 'Core Operational',
    id: '0',
    isDisabled: false,
    type: 'Classification',
  },
  {
    name: 'Core Strategic',
    id: '1',
    isDisabled: false,
    type: 'Classification',
  },
  {
    name: 'Surplus Active',
    id: '2',
    isDisabled: false,
    type: 'Classification',
  },
  {
    name: 'Surplus Encumbered',
    id: '3',
    isDisabled: false,
    type: 'Classification',
  },
] as ILookupCode[];

export const AGENCIES = [
  {
    name: 'AEST',
    id: '1',
    isDisabled: false,
    type: 'Agency',
  },
  {
    name: 'HTLH',
    id: '2',
    isDisabled: false,
    type: 'Agency',
  },
  {
    name: 'MOTI',
    id: '3',
    isDisabled: false,
    type: 'Agency',
  },
  {
    name: 'FLNR',
    id: '4',
    isDisabled: false,
    type: 'Agency',
  },
  {
    name: 'MAH',
    id: '5',
    isDisabled: false,
    type: 'Agency',
  },
];

export const PARCELS = [
  { id: 1, latitude: 48, longitude: 123 },
  { id: 2, latitude: 50, longitude: 133 },
] as IParcel[];

export const mockDetails = [
  {
    id: 1,
    pid: '000-000-000',
    latitude: 48,
    longitude: 123,
    propertyStatus: 'active',
    classification: 'Core Operational',
    description: 'test',
    evaluations: [
      {
        assessedValue: 1000000,
        estimatedValue: 0,
        netBookValue: 0,
        fiscalYear: 2019,
      },
    ],
    address: {
      line1: '1234 mock Street',
      line2: 'N/A',
      city: 'Victoria',
      province: 'BC',
      postal: 'V1V1V1',
    },
    landArea: 'unknown',
    landLegalDescription: 'test',
    buildings: [],
    agency: 'MOTI',
  },
  {
    id: 2,
    pid: '000-000-000',
    latitude: 50,
    longitude: 133,
    propertyStatus: 'active',
    classification: 'Core Operational',
    description: 'test',
    assessedValue: 1000000,
    address: {
      line1: '1234 mock Street',
      line2: 'N/A',
      city: 'Victoria',
      province: 'BC',
      postal: 'V1V1V1',
    },
    landArea: 'unknown',
    landLegalDescription: 'test',
    buildings: [],
    agency: 'HLTH',
  },
] as IParcelDetail[];

export const ACTIVE = {
  id: 1,
  pid: '000-000-000',
  latitude: 48,
  longitude: 123,
  propertyStatus: 'active',
  classification: 'Core Operational',
  description: 'test',
  evaluations: [
    {
      assessedValue: 1000000,
      estimatedValue: 0,
      netBookValue: 0,
      fiscalYear: 2019,
    },
  ],
  address: {
    line1: '1234 mock Street',
    line2: 'N/A',
    city: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
  },
  landArea: 'unknown',
  landLegalDescription: 'test',
  buildings: [],
  agency: 'FIN',
} as IParcelDetail;

export const mockAgencyModel = {
  bounds: null,
  agencyId: 1,
  propertyClassificationId: null,
} as MapFilterModel;
