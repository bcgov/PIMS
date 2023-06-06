import moment from 'moment';
import { z } from 'zod';

const AccessRequestUserSchema = z.object({
  firstName: z.string().nonempty('Required'),
  lastName: z.string().nonempty('Required'),
  position: z.string().max(100, 'Note must be less than 100 characters'),
});

export const AccessRequestSchema = z.object({
  agency: z.number().min(1, 'Invalid Agency').nonnegative('Required').or(z.string()),
  role: z.string().min(1, 'Invalid Role').nonempty('Required'),
  note: z.string().max(1000, 'Note must be less than 1000 characters'),
  user: AccessRequestUserSchema,
});

export const UserUpdateSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  firstName: z.string().max(100, 'First Name must be less than 100 characters'),
  lastName: z.string().max(100, 'Last Name must be less than 100 characters'),
});

export const AgencyEditSchema = z.object({
  email: z
    .string()
    .max(100, 'Email must be less than 100 characters')
    .email('Please enter a valid email.')
    .optional(),
  name: z
    .string()
    .max(100, 'Agency name must be less than 100 characters')
    .nonempty('An agency name is required.'),
  addressTo: z.string().max(100, 'Email addressed to must be less than 100 characters').optional(),
  code: z.string().nonempty('An agency code is required.'),
  sendEmail: z.boolean(),
});

export const AdministrativeAreaSchema = z.object({
  name: z.string().nonempty('A name is required for administrative areas'),
});

export const UserSchema = z.object({
  email: z.string().email().max(100, 'Email must be less than 100 characters').nonempty('Required'),
  firstName: z
    .string()
    .max(100, 'First Name must be less than 100 characters')
    .nonempty('Required'),
  middleName: z.string().max(100, 'Middle Name must be less than 100 characters').optional(),
  lastName: z.string().max(100, 'Last Name must be less than 100 characters').nonempty('Required'),
  role: z.number().min(1, 'Invalid Role').nullable().optional(),
  agency: z.number().min(1, 'Invalid Agency').nullable().optional(),
});

export const Address = z.object({
  line1: z.string().max(150, 'Address must be less then 150 characters').nonempty('Required'),
  line2: z.string().max(150, 'Address must be less then 150 characters').optional(),
  administrativeArea: z
    .string()
    .regex(/\d*/, 'Invalid Location')
    .nonempty('Required')
    .nullable()
    .optional(),
  provinceId: z.string().nonempty('Required'),
  postal: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === '' || value === undefined
          ? true
          : /^[a-zA-z][0-9][a-zA-z][\s-]?[0-9][a-zA-z][0-9]$/.test(value),
      'Invalid Postal Code',
    ),
});

const currentYear = moment().year();
export const Financial = z.object({
  year: z.number().optional(),
  date: z.string().nullable().optional(),
  key: z.string().nullable().optional(),
  value: z
    .string()
    .regex(/\d+(\.\d{1,2})?/, 'Only two decimal places are allowed')
    .or(z.null()),
});
const FinancialYear = z.object({
  assessed: Financial,
  appraised: Financial,
  netbook: Financial,
  market: Financial,
});

export const OccupancySchema = z.object({
  rentableArea: z
    .number()
    .min(1, 'Net Usable Area must be greater than 0')
    .or(z.string().nonempty('Required')),
  totalArea: z.number().or(z.string().nonempty('Required')),
  buildingTenancy: z.string().max(100, 'Tenancy must be less than 100 characters').optional(),
  buildingTenancyUpdatedOn: z.string().nullable().optional(),
});

export const BuildingInformationSchema = z.object({
  name: z.string().max(150, 'Name must be less than 150 characters').nullable().optional(),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable()
    .optional(),
  latitude: z
    .number()
    .min(-90, 'Invalid Latitude')
    .max(90, 'Invalid Latitude')
    .or(z.string().nonempty('Required')),
  longitude: z
    .number()
    .min(-180, 'Invalid Longitude')
    .max(180, 'Invalid Longitude')
    .or(z.string().nonempty('Required')),
  buildingConstructionTypeId: z
    .string()
    .nonempty('Required')
    .regex(/\d*/, 'Invalid Building Construction Type')
    .or(z.number())
    .nullable(),
  buildingPredominateUseId: z
    .string()
    .nonempty('Required')
    .regex(/\d*/, 'Invalid Building Predominate Use')
    .or(z.number())
    .nullable(),
  classificationId: z
    .string()
    .nonempty('Required')
    .regex(/\d*/, 'Invalid Building Classification Id')
    .or(z.number())
    .nullable(),
  buildingFloorCount: z
    .number()
    .min(0, 'Floor Count must be a valid number')
    .or(z.string())
    .optional(),
  address: Address,
  agencyId: z.number().or(z.string()).optional(),
  isSensitive: z
    .boolean()
    .or(z.string().nonempty('Required'))
    .refine((value) => value !== undefined, 'Required'),
});

export const BuildingSchema = z
  .object({
    transferLeaseOnSale: z.boolean().optional(),
    leaseExpiry: z.string().nullable().optional(),
    financials: z
      .array(
        FinancialYear.refine(
          (financial) =>
            financial.assessed.year !== currentYear &&
            financial.appraised.year !== currentYear &&
            financial.netbook.year !== currentYear &&
            financial.market.year !== currentYear,
          'Year must not be the current year.',
        ),
      )
      .optional(),
  })
  .and(OccupancySchema)
  .and(BuildingInformationSchema);

export const LandSchema = z.object({
  classificationId: z
    .string()
    .refine((value) => /\d*/.test(value), 'Invalid Classification')
    .or(z.number())
    .nullable(),
  address: Address,
  name: z.string().max(150, 'Name must be less than 150 characters').nullable().optional(),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable()
    .optional(),
  administrativeArea: z
    .string()
    .max(250, 'Location must be less than 250 characters')
    .nullable()
    .optional(),
  zoning: z.string().max(250, 'Zoning must be less than 250 characters').nullable().optional(),
  zoningPotential: z
    .string()
    .max(250, 'Zoning Potential must be less than 250 characters')
    .nullable()
    .optional(),
  landLegalDescription: z
    .string()
    .max(500, 'Land Legal Description must be less than 500 characters')
    .nullable()
    .optional(),
  latitude: z
    .number()
    .min(-90, 'Invalid Latitude')
    .max(90, 'Invalid Latitude')
    .refine((value) => !isNaN(value), 'Required'),
  longitude: z
    .number()
    .min(-180, 'Invalid Longitude')
    .max(180, 'Invalid Longitude')
    .refine((value) => !isNaN(value), 'Required'),
  landArea: z
    .number()
    .refine((value) => Number(value) >= 0 && Number(value) < 200000, 'Please enter a valid number')
    .or(z.string().nonempty('Required')),
  lotSize: z.number().optional(),
  isSensitive: z
    .boolean()
    .or(z.string().nonempty('Required'))
    .refine((value) => value !== undefined, 'Required'),
  parcels: z.array(z.unknown()),
});

export const ParcelSchema = z
  .object({
    pid: z
      .string()
      .refine((value) => {
        if (value === '') return true; // Allow empty string
        return value.match(/\d\d\d[\s-]?\d\d\d[\s-]?\d\d\d/);
      }, 'PID must be in the format ###-###-###')
      .optional(),
    pin: z
      .string()
      .or(z.number())
      .refine((value) => {
        if (value === '') return true; // Allow empty string
        return value && String(value).length <= 9;
      }, 'PIN must be less or equal than 9 characters')
      .optional(),
    buildings: z.array(z.unknown()),
    financials: z.array(FinancialYear).optional(),
    agencyId: z.number(),
  })
  .and(LandSchema);

export const FilterBarSchema = z
  .object({
    minLotSize: z.number().positive().max(200000).or(z.string()).optional(),
    maxLotSize: z.number().positive().max(200000).or(z.string()).optional(),
    inEnhancedReferralProcess: z.boolean().optional(),
    inSurplusPropertyProgram: z.boolean().optional(),
    surplusFilter: z.unknown().optional(),
  })
  .refine(
    (data) => {
      if (data.minLotSize && data.maxLotSize) {
        return data.maxLotSize > data.minLotSize;
      }
      return true;
    },
    {
      message: 'Must be greater than Min Lot Size',
      path: ['maxLotSize'],
    },
  )
  .refine(
    (data) => {
      if (!data.surplusFilter) return true;

      return data.inEnhancedReferralProcess || data.inSurplusPropertyProgram;
    },
    {
      message: 'ERP or SPL Properties required when using the Surplus Properties filter.',
      path: ['inEnhancedReferralProcess', 'inSurplusPropertyProgram'],
    },
  );

export const AssociatedLandOwnershipSchema = z.object({
  type: z
    .number()
    .int()
    .refine((value) => value !== undefined, 'Choose an option'),
});

export const LandUsageSchema = z.object({
  zoning: z.string().max(250).nullable().optional(),
  zoningPotential: z.string().max(250).nullable().optional(),
  classificationId: z
    .string()
    .nullable()
    .optional()
    .refine((id) => id && /^\d*$/.test(id), 'Invalid Classification')
    .refine((id) => id !== undefined && id !== null, 'Required')
    .or(z.number()),
});

export const ValuationSchema = z.object({
  financials: z
    .array(FinancialYear)
    .refine(
      (financials) =>
        financials.every(
          (financial) =>
            financial.assessed.year !== currentYear &&
            financial.appraised.year !== currentYear &&
            financial.netbook.year !== currentYear &&
            financial.market.year !== currentYear,
        ),
      'Financial year must not be the current year.',
    )
    .optional(),
});

export const LandIdentificationSchema = z.object({
  pid: z
    .string()
    .optional()
    .refine(
      (pid) => pid === undefined || /\d\d\d-\d\d\d-\d\d\d/.test(pid),
      'PID must be in the format ###-###-###',
    ),
  pin: z
    .string()
    .or(z.number())
    .optional()
    .refine(
      (pin) => pin === undefined || (typeof pin !== 'number' && pin.length <= 9),
      'Please enter a valid PIN no longer than 9 digits.',
    ),
  address: Address,
  name: z.string().max(150).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  landLegalDescription: z.string().max(500).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  landArea: z.number().min(0).max(200000).or(z.string()).nullable().optional(),
  agencyId: z.number().nullable().optional(),
  lotSize: z.number().nullable().optional(),
  isSensitive: z.boolean().or(z.string()).nullable().optional(),
  parcels: z.array(ParcelSchema),
});

export const AssociatedLandSchema = z.object({
  data: z.object({
    parcels: z.array(ParcelSchema),
  }),
});
