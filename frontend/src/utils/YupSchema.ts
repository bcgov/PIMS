import * as Yup from 'yup';
import moment from 'moment';
import { emptyStringToNull } from 'utils';
import { PropertyTypes } from 'constants/propertyTypes';

Yup.addMethod(Yup.string, 'optional', function optional() {
  return this.transform(value => {
    return (typeof value == 'string' && !value) ||
      (value instanceof Array && !value.length) ||
      value === null // allow to skip "nullable"
      ? undefined
      : value;
  });
});

export const AccessRequestSchema = Yup.object().shape({
  agency: Yup.number()
    .min(1, 'Invalid Agency')
    .required('Required'),
  role: Yup.string()
    .min(1, 'Invalid Role')
    .required('Required'),
  note: Yup.string().max(1000, 'Note must be less than 1000 characters'),
  user: Yup.object().shape({
    position: Yup.string().max(100, 'Note must be less than 100 characters'),
  }),
});

export const UserUpdateSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .max(100, 'Email must be less than 100 characters'),
  firstName: Yup.string().max(100, 'First Name must be less than 100 characters'),
  middleName: Yup.string().max(100, 'Middle Name must be less than 100 characters'),
  lastName: Yup.string().max(100, 'Last Name must be less than 100 characters'),
});

export const AgencyEditSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email.')
    .max(100, 'Email must be less than 100 characters')
    .when('sendEmail', (sendEmail: boolean, schema: any) =>
      sendEmail ? schema.required('Email address is required') : schema,
    ),
  name: Yup.string()
    .max(100, 'Agency name must be less than 100 characters')
    .required('An agency name is required.'),
  addressTo: Yup.string()
    .max(100, 'Email addressed to must be less than 100 characters')
    .when('sendEmail', (sendEmail: boolean, schema: any) =>
      sendEmail ? schema.required('Email addressed to is required (i.e. Good Morning)') : schema,
    ),
  code: Yup.string().required('An agency code is required.'),
});

export const UserSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .max(100, 'Email must be less than 100 characters')
    .required('Required'),
  firstName: Yup.string()
    .max(100, 'First Name must be less than 100 characters')
    .required('Required'),
  middleName: Yup.string().max(100, 'Middle Name must be less than 100 characters'),
  lastName: Yup.string()
    .max(100, 'Last Name must be less than 100 characters')
    .required('Required'),
  role: Yup.number()
    .min(1, 'Invalid Role')
    .nullable(),
  agency: Yup.number()
    .min(1, 'Invalid Agency')
    .nullable(),
});

export const Address = Yup.object().shape({
  line1: Yup.string()
    .max(150, 'Address must be less then 150 characters')
    .required('Required'),
  line2: Yup.string().max(150, 'Address must be less then 150 characters'),
  administrativeArea: Yup.string()
    .matches(/\d*/, 'Invalid Location')
    .required('Required')
    .nullable(),
  provinceId: Yup.string().required('Required'),
  postal: (Yup.string() as any)
    .optional()
    .matches(/^[a-zA-z][0-9][a-zA-z][\s-]?[0-9][a-zA-z][0-9]$/, 'Invalid Postal Code'),
});

const currentYear = moment().year();
export const Financial = Yup.object().shape({
  year: Yup.number(),
  date: Yup.string().nullable(),
  key: Yup.string().nullable(),
  value: Yup.string()
    .nullable()
    .matches(/\d+(\.\d{1,2})?/, 'Only two decimal places are allowed'),
});
export const FinancialYear = Yup.object().shape({
  assessed: Financial.required(),
  appraised: Financial.required(),
  netbook: Financial.required(),
  market: Financial.required(),
});

export const OccupancySchema = Yup.object().shape({
  rentableArea: Yup.number()
    .min(1, 'Net Usable Area must be greater than 0')
    .max(Yup.ref('totalArea'), 'Net Usable Area cannot be larger than Total Area')
    .transform(emptyStringToNull)
    .required('Required'),
  totalArea: Yup.number()
    .min(Yup.ref('rentableArea'), 'Total Area must not be smaller than Net Usable Area')
    .transform(emptyStringToNull)
    .required('Required'),
  buildingTenancy: Yup.string().max(100, 'Tenancy must be less then 100 characters'),
  buildingTenancyUpdatedOn: Yup.string().when('buildingTenancy', {
    is: val => val && val.length > 0,
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
});

export const BuildingInformationSchema = Yup.object().shape({
  name: Yup.string()
    .max(150, 'Name must be less then 150 characters')
    .nullable(),
  description: Yup.string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable(),
  latitude: Yup.number()
    .min(-90, 'Invalid Latitude')
    .max(90, 'Invalid Latitude')
    .transform(emptyStringToNull)
    .required('Required'),
  longitude: Yup.number()
    .min(-180, 'Invalid Longitude')
    .max(180, 'Invalid Longitude')
    .transform(emptyStringToNull)
    .required('Required'),
  buildingConstructionTypeId: Yup.string()
    .matches(/\d*/, 'Invalid Building Construction Type')
    .required('Required')
    .nullable(),
  buildingPredominateUseId: Yup.string()
    .matches(/\d*/, 'Invalid Building Predominate Use')
    .required('Required')
    .nullable(),
  classificationId: Yup.string()
    .matches(/\d*/, 'Invalid Building Classification Id')
    .required('Required')
    .nullable(),
  buildingFloorCount: Yup.number()
    .min(0, 'Floor Count must be a valid number')
    .transform(emptyStringToNull),
  address: Address.required(),
  agencyId: Yup.number()
    .transform(emptyStringToNull)
    .required('Required'),
  isSensitive: Yup.boolean()
    .nullable()
    .transform(emptyStringToNull)
    .required('Required'),
});

export const BuildingSchema = Yup.object()
  .shape({
    transferLeaseOnSale: Yup.boolean(),
    leaseExpiry: Yup.string().nullable(),
    financials: Yup.array()
      .compact((financial: any) => financial.year !== currentYear)
      .of(FinancialYear),
  })
  .concat(OccupancySchema)
  .concat(BuildingInformationSchema);

export const LandSchema = Yup.object().shape({
  classificationId: Yup.string()
    .required('Required')
    .matches(/\d*/, 'Invalid Classification')
    .nullable(),
  address: Address.required(),
  name: Yup.string()
    .max(150, 'Name must be less then 150 characters')
    .nullable(),
  description: Yup.string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable(),
  administrativeArea: Yup.string()
    .max(250, 'Location must be less than 250 characters')
    .nullable(),
  zoning: Yup.string()
    .max(250, 'Zoning must be less than 250 characters')
    .nullable(),
  zoningPotential: Yup.string()
    .max(250, 'Zoning Potential must be less than 250 characters')
    .nullable(),
  landLegalDescription: Yup.string()
    .max(500, 'Land Legal Description must be less than 500 characters')
    .nullable(),
  latitude: Yup.number()
    .min(-90, 'Invalid Latitude')
    .max(90, 'Invalid Latitude')
    .transform(emptyStringToNull)
    .required('Required'),
  longitude: Yup.number()
    .min(-180, 'Invalid Longitude')
    .max(180, 'Invalid Longitude')
    .transform(emptyStringToNull)
    .required('Required'),
  landArea: Yup.number()
    .min(0, 'Land Area must be a positive number')
    .transform(emptyStringToNull)
    .required('Required')
    .test('is-valid', 'Please enter a valid number', val => Number(val) < 200000),
  lotSize: Yup.number(),
  isSensitive: Yup.boolean()
    .transform(emptyStringToNull)
    .required('Required'),
  parcels: Yup.array().when('propertyTypeId', {
    is: val => val === PropertyTypes.SUBDIVISION,
    then: Yup.array().required('You must add at least one parent parcel'),
    otherwise: Yup.array(),
  }),
});
export const ParcelSchema = Yup.object()
  .shape(
    {
      pid: Yup.string().when('pin', {
        is: val => val && val.length > 0,
        then: Yup.string().nullable(),
        otherwise: Yup.string()
          .matches(/\d\d\d[\s-]?\d\d\d[\s-]?\d\d\d/, 'PID must be in the format ###-###-###')
          .required('PID or PIN Required'),
      }),
      pin: Yup.string().when('pid', {
        is: val => val && /\d\d\d-\d\d\d-\d\d\d/.test(val),
        then: Yup.string().nullable(),
        otherwise: Yup.string()
          .nullable()
          .required('PID or PIN Required')
          .max(9, 'Please enter a valid PIN no longer than 9 digits.'),
      }),
      buildings: Yup.array(),
      financials: Yup.array()
        .compact((financial: any) => financial.year !== currentYear)
        .of(FinancialYear),
      agencyId: Yup.number()
        .transform(emptyStringToNull)
        .required('Required'),
    },
    [['pin', 'pid']],
  )
  .concat(LandSchema);

export const FilterBarSchema = Yup.object().shape(
  {
    minLotSize: Yup.number()
      .typeError('Invalid')
      .positive('Must be greater than 0')
      .max(200000, 'Invalid'),
    maxLotSize: Yup.number()
      .typeError('Invalid')
      .positive('Must be greater than 0')
      .max(200000, 'Invalid')
      /* Reference minLotSize field in validating maxLotSize value */
      .moreThan(Yup.ref('minLotSize'), 'Must be greater than Min Lot Size'),
    inEnhancedReferralProcess: Yup.boolean().when(['inSurplusPropertyProgram', 'surplusFilter'], {
      is: (inSurplusPropertyProgram, surplusFilter) => {
        if (!surplusFilter) {
          return true;
        }
        if (inSurplusPropertyProgram) {
          return true;
        }
      },
      then: Yup.boolean().nullable(),
      otherwise: Yup.boolean().required(
        'ERP or SPL Properties required when using the Surplus Properties filter.',
      ),
    }),
    inSurplusPropertyProgram: Yup.boolean().when(['inEnhancedReferralProcess', 'surplusFilter'], {
      is: (inEnhancedReferralProcess, surplusFilter) => {
        if (!surplusFilter) {
          return true;
        }
        if (inEnhancedReferralProcess) {
          return true;
        }
      },
      then: Yup.boolean().nullable(),
      otherwise: Yup.boolean().required(
        'ERP or SPL Properties required when using the Surplus Properties filter.',
      ),
    }),
  },
  [['inSurplusPropertyProgram', 'inEnhancedReferralProcess']],
);

export const AssociatedLandOwnershipSchema = Yup.object().shape({
  type: Yup.number().required('Choose an option'),
});

export const LandUsageSchema = Yup.object().shape({
  zoning: Yup.string()
    .max(250, 'Zoning must be less than 250 characters')
    .nullable(),
  zoningPotential: Yup.string()
    .max(250, 'Zoning Potential must be less than 250 characters')
    .nullable(),
  classificationId: Yup.string()
    .required('Required')
    .matches(/\d*/, 'Invalid Classification')
    .nullable(),
});

export const ValuationSchema = Yup.object().shape({
  financials: Yup.array()
    .compact((financial: any) => financial.year !== currentYear)
    .of(FinancialYear),
});

export const LandIdentificationSchema = Yup.object().shape(
  {
    pid: Yup.string().when('pin', {
      is: val => val && val.length > 0,
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .matches(/\d\d\d[\s-]?\d\d\d[\s-]?\d\d\d/, 'PID must be in the format ###-###-###')
        .required('PID or PIN Required'),
    }),
    pin: Yup.string().when('pid', {
      is: val => val && /\d\d\d-\d\d\d-\d\d\d/.test(val),
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .nullable()
        .required('PID or PIN Required')
        .max(9, 'Please enter a valid PIN no longer than 9 digits.'),
    }),
    address: Address.required(),
    name: Yup.string()
      .max(150, 'Name must be less then 150 characters')
      .nullable(),
    description: Yup.string()
      .max(2000, 'Description must be less than 2000 characters')
      .nullable(),
    landLegalDescription: Yup.string()
      .max(500, 'Land Legal Description must be less than 500 characters')
      .nullable(),
    latitude: Yup.number()
      .min(-90, 'Invalid Latitude')
      .max(90, 'Invalid Latitude')
      .transform(emptyStringToNull)
      .required('Required'),
    longitude: Yup.number()
      .min(-180, 'Invalid Longitude')
      .max(180, 'Invalid Longitude')
      .transform(emptyStringToNull)
      .required('Required'),
    landArea: Yup.number()
      .min(0, 'Land Area must be a positive number')
      .transform(emptyStringToNull)
      .required('Required')
      .test('is-valid', 'Please enter a valid number', val => Number(val) < 200000),
    agencyId: Yup.number()
      .transform(emptyStringToNull)
      .required('Required'),
    lotSize: Yup.number(),
    isSensitive: Yup.boolean()
      .nullable()
      .transform(emptyStringToNull)
      .required('Required'),
    parcels: Yup.array().when('propertyTypeId', {
      is: val => val === PropertyTypes.SUBDIVISION,
      then: Yup.array().required('You must add at least one parent parcel'),
      otherwise: Yup.array(),
    }),
  },
  [['pin', 'pid']],
);

export const AssociatedLandSchema = Yup.object().shape({
  data: Yup.object().shape({ parcels: Yup.array().of(ParcelSchema) }),
});
