import * as Yup from 'yup';
export const AccessRequestSchema = Yup.object().shape({
  agency: Yup.number()
    .min(1, 'Invalid Agency')
    .required('Required'),
  role: Yup.string()
    .min(1, 'Invalid Role')
    .required('Required'),
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
  address1: Yup.string().max(150, 'Address must be less then 150 characters'),
  address2: Yup.string().max(150, 'Address must be less then 150 characters'),
  city: Yup.number()
    .min(1, 'Invalid City')
    .required('Required'),
  province: Yup.number()
    .min(1, 'Invalid Province')
    .required('Required'),
  postal: Yup.string().matches(
    /[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ][0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]/,
    'Invalid Postal Code',
  ),
});

export const Evaluation = Yup.object().shape({
  fiscalYear: Yup.number()
    .min(1900, 'Invalid Fiscal Year')
    .min(2100, 'Invalid Fiscal Year')
    .required('Required'),
  estimatedValue: Yup.number()
    .min(1, 'Estimated Value must be a positive number')
    .required('Required'),
  appraisedValue: Yup.number()
    .min(1, 'Appraised Value must be a positive number')
    .required('Required'),
  assessedValue: Yup.number()
    .min(1, 'Assessed Value must be a positive number')
    .required('Required'),
  netBookValue: Yup.number()
    .min(1, 'Net Book Value must be a positive number')
    .required('Required'),
});

export const Building = Yup.object().shape({
  localId: Yup.string().max(50, 'LocalId must be less then 50 characters'),
  description: Yup.string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable(),
  address: Yup.mixed().oneOf([
    Yup.number()
      .min(1, 'The associated Address is invalid')
      .required('Required'),
    Address,
    //support a reference to an existing address (by id) or just the address schema itself.
  ]),
  latitude: Yup.number()
    .min(-90, 'Invalid Latitude')
    .max(90, 'Invalid Latitude')
    .required('Required'),
  longitude: Yup.number()
    .min(-180, 'Invalid Longitude')
    .max(180, 'Invalid Longitude')
    .required('Required'),
  constructionType: Yup.number()
    .min(1, 'Invalid Building Construction Type')
    .required('Required'),
  predominateUse: Yup.number()
    .min(1, 'Invalid Building Predominate Use')
    .required('Required'),
  floorCount: Yup.number()
    .min(1, 'Floor Count must be a positive number')
    .required('Required'),
  tenancy: Yup.string()
    .max(100, 'Tenancy must be less then 100 characters')
    .required('Required'),
  rentableArea: Yup.number()
    .min(1, 'Rentable Area must be a positive number')
    .required('Required'),
  agency: Yup.number()
    .min(1, 'Invalid Agency')
    .required('Required'),
  isSensitive: Yup.boolean(),
  evaluations: Yup.array().of(
    Yup.mixed().oneOf([
      Yup.number()
        .min(1, 'The associated Evaluation is invalid')
        .required('Required'),
      Evaluation,
    ]),
  ),
});

export const ParcelSchema = Yup.object().shape({
  pid: Yup.string()
    .matches(/\d\d\d-\d\d\d-\d\d\d/, 'PID must be in the format ###-###-###')
    .required('Required'),
  pin: Yup.number().nullable(),
  statusId: Yup.number()
    .min(1, 'Invalid Status')
    .required('Required'),
  classificationId: Yup.number()
    .min(1, 'Invalid Classification')
    .required('Required'),
  agency: Yup.number()
    .min(1, 'Invalid Agency')
    .required('Required'),
  address: Yup.mixed().oneOf([
    Yup.number()
      .min(1, 'The associated Address is invalid')
      .required('Required'),
    Address,
  ]),
  description: Yup.string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable(),
  landLegalDescription: Yup.string()
    .max(500, 'Land Legal Description must be less than 500 characters')
    .nullable(),
  latitude: Yup.number()
    .min(-90, 'Invalid Latitude')
    .max(90, 'Invalid Latitude')
    .required('Required'),
  longitude: Yup.number()
    .min(-180, 'Invalid Longitude')
    .max(180, 'Invalid Longitude')
    .required('Required'),
  landArea: Yup.number()
    .min(1, 'Land Area must be a positive number')
    .required('Required'),
  isSensitive: Yup.boolean(),
  buildings: Yup.array().of(
    Yup.mixed().oneOf([
      Yup.number()
        .min(1, 'The associated Building is invalid')
        .required('Required'),
      Building,
    ]),
  ),
  evaluations: Yup.array().of(
    Yup.mixed().oneOf([
      Yup.number()
        .min(1, 'The associated Evaluation is invalid')
        .required('Required'),
      Evaluation,
    ]),
  ),
});
