import z from 'zod';

export const MapFilterSchema = z.object({
  PID: z.coerce.number().nonnegative().optional(),
  PIN: z.coerce.number().nonnegative().optional(),
  Address: z.string().optional(),
  AgencyIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  AdministrativeAreaIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  ClassificationIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  PropertyTypeIds: z.array(z.coerce.number().int().nonnegative()).optional(),
  Name: z.string().optional(),
});
