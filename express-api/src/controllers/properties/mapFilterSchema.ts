import z, { ZodTypeAny } from 'zod';

const arrayFromString = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((obj) => {
    if (Array.isArray(obj)) {
      return obj;
    } else if (typeof obj === 'string') {
      return obj.split(',');
    } else {
      return [];
    }
  }, z.array(schema));
};

const numberSchema = z.coerce.number().nonnegative().optional();

export const MapFilterSchema = z.object({
  PID: numberSchema,
  PIN: numberSchema,
  Address: z.string().optional(),
  AgencyIds: arrayFromString(numberSchema),
  AdministrativeAreaIds: arrayFromString(numberSchema),
  ClassificationIds: arrayFromString(numberSchema),
  PropertyTypeIds: arrayFromString(numberSchema),
  Name: z.string().optional(),
});
