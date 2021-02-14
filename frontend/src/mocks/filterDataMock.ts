import { ILookupCode } from '../actions/lookupActions';
import { IParcel, IProperty } from 'actions/parcelsActions';
import { IProperty as IFlatProperty } from 'features/properties/list';

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
    sortOrder: 1,
    isVisible: true,
  },
  {
    name: 'Core Strategic',
    id: '1',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 2,
    isVisible: true,
  },
  {
    name: 'Surplus Active',
    id: '2',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 3,
    isVisible: true,
  },
  {
    name: 'Surplus Encumbered',
    id: '3',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 4,
    isVisible: true,
  },
  {
    name: 'Disposed',
    id: '4',
    isDisabled: false,
    type: 'Classification',
    sortOrder: 5,
    isVisible: false,
  },
] as ILookupCode[];

export const ADMINISTRATIVEAREAS = [
  {
    code: '0',
    name: 'Victoria',
    id: '0',
    isDisabled: false,
    type: 'AdministrativeArea',
  },
  {
    code: '1',
    name: 'Royal Oak',
    id: '1',
    isDisabled: false,
    type: 'AdministrativeArea',
  },
] as ILookupCode[];

export const AGENCIES = [
  {
    code: 'AEST',
    name: 'AEST',
    id: '1',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'HTLH',
    name: 'HTLH',
    id: '2',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'MOTI',
    name: 'MOTI',
    id: '3',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'FLNR',
    name: 'FLNR',
    id: '4',
    isDisabled: false,
    type: 'Agency',
  },
  {
    code: 'MAH',
    name: 'MAH',
    id: '5',
    isDisabled: false,
    type: 'Agency',
  },
];

export const PARCELS = [
  { id: 1, latitude: 48, longitude: 123 },
  { id: 2, latitude: 50, longitude: 133 },
] as IProperty[];

export const mockDetails = [
  {
    id: 1,
    pid: '000-000-000',
    pin: '',
    projectNumber: '',
    zoning: '',
    zoningPotential: '',
    classificationId: 1,
    encumbranceReason: '',
    agencyId: 1,
    isSensitive: false,
    latitude: 48,
    longitude: 123,
    propertyStatus: 'active',
    classification: 'Core Operational',
    name: 'test name',
    description: 'test',
    assessedLand: 10000,
    assessedBuilding: 10000,
    evaluations: [
      {
        date: new Date(),
        key: 'Assessed',
        value: 10000,
      },
    ],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'NetBook',
        value: 10000,
      },
    ],
    address: {
      id: 1,
      line1: '1234 mock Street',
      line2: 'N/A',
      administrativeArea: 'Victoria',
      province: 'BC',
      postal: 'V1V1V1',
      provinceId: '1',
    },
    landArea: 123,
    landLegalDescription: 'test',
    buildings: [],
    parcels: [],
    agency: 'MOTI',
    propertyTypeId: 0,
  },
  {
    id: 2,
    pid: '000-000-000',
    pin: '',
    zoning: '',
    zoningPotential: '',
    classificationId: 1,
    encumbranceReason: '',
    agencyId: 2,
    isSensitive: false,
    latitude: 50,
    longitude: 133,
    classification: 'Core Operational',
    name: 'test name',
    description: 'test',
    assessedLand: 10000,
    assessedBuilding: 10000,
    address: {
      id: 1,
      line1: '1234 mock Street',
      line2: 'N/A',
      administrativeArea: 'Victoria',
      provinceId: '1',
      province: 'BC',
      postal: 'V1V1V1',
    },
    landArea: 123,
    landLegalDescription: 'test',
    buildings: [],
    parcels: [],
    evaluations: [
      {
        date: new Date(),
        key: 'Assessed',
        value: 10000,
      },
    ],
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'NetBook',
        value: 10000,
      },
    ],
    agency: 'HLTH',
  },
] as IParcel[];

export const mockFlatProperty: IFlatProperty = {
  id: 0,
  propertyTypeId: 0,
  propertyType: 'Land',
  latitude: 23,
  longitude: 23,
  pid: '123-123-123',
  classificationId: 2,
  classification: 'Surplus Active',
  description: 'test',
  isSensitive: false,
  agencyId: 1,
  agency: 'test',
  agencyCode: 'TST',
  address: '1234 Test St',
  addressId: 1,
  administrativeArea: 'Victoria',
  province: 'BC',
  postal: 'A1A 1A1',
  market: 123,
  netBook: 223,
  assessedLand: 123,
  appraised: 1000,
  landArea: 123,
  landLegalDescription: 'test',
} as IFlatProperty;

export const ACTIVE = {
  id: 1,
  pid: '000-000-000',
  pin: '',
  projectNumber: '',
  zoning: '',
  zoningPotential: '',
  classificationId: 1,
  encumbranceReason: '',
  agencyId: '',
  isSensitive: false,
  latitude: 48,
  longitude: 123,
  classification: 'Core Operational',
  name: 'test name',
  description: 'test',
  assessedLand: 10000,
  assessedBuilding: 10000,
  evaluations: [
    {
      date: new Date(),
      key: 'Assessed',
      value: 10000,
    },
  ],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'NetBook',
      value: 10000,
    },
  ],
  address: {
    id: 1,
    line1: '1234 mock Street',
    line2: 'N/A',
    administrativeArea: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
    provinceId: '1',
  },
  landArea: 123,
  landLegalDescription: 'test',
  buildings: [],
  parcels: [],
  agency: 'FIN',
} as IParcel;
