import * as Yup from 'yup';
import moment from 'moment';

function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return undefined;
  }
  return value;
}

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
  postal: Yup.string().matches(
    /^[a-zA-z][0-9][a-zA-z][\s-]?[0-9][a-zA-z][0-9]$/,
    'Invalid Postal Code',
  ),
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
  estimated: Financial.required(),
});

export const Building = Yup.object().shape({
  name: Yup.string()
    .max(150, 'Name must be less then 150 characters')
    .nullable(),
  description: Yup.string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable(),
  address: Address.nullable(),
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
  buildingOccupantTypeId: Yup.string()
    .matches(/\d*/, 'Invalid Building Occupant Type')
    .required('Required')
    .nullable(),
  classificationId: Yup.string()
    .matches(/\d*/, 'Invalid Building Classification Id')
    .required('Required')
    .nullable(),
  buildingFloorCount: Yup.number()
    .min(1, 'Floor Count must be a positive number')
    .transform(emptyStringToNull)
    .required('Required'),
  buildingTenancy: Yup.string().max(100, 'Tenancy must be less then 100 characters'),
  rentableArea: Yup.number()
    .min(0, 'Rentable Area must be a positive number')
    .transform(emptyStringToNull)
    .required('Required'),
  agencyId: Yup.number()
    .transform(emptyStringToNull)
    .required('Required'),
  isSensitive: Yup.boolean(),
  transferLeaseOnSale: Yup.boolean(),
  leaseExpiry: Yup.string().nullable(),
  financials: Yup.array()
    .compact((financial: any) => financial.year !== currentYear)
    .of(FinancialYear),
});
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
          .min(1)
          .nullable()
          .required('PID or PIN Required')
          .max(9, 'Please enter a valid PIN no longer than 9 digits.'),
      }),
      buildings: Yup.array().of(Building),
      financials: Yup.array()
        .compact((financial: any) => financial.year !== currentYear)
        .of(FinancialYear),
    },
    [['pin', 'pid']],
  )
  .concat(LandSchema);

export const FilterBarSchema = Yup.object().shape({
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
});
