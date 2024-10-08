import z from 'zod';

export const BuildingFilterSchema = z.object({
  pid: z.coerce.number().nonnegative().optional(),
  classificationId: z.coerce.number().nonnegative().optional(),
  agencyId:
    z.coerce.number().nonnegative().optional() ||
    z.array(z.coerce.number().int().nonnegative()).optional(),
  administrativeAreaId: z.coerce.number().nonnegative().optional(),
  propertyTypeId: z.coerce.number().nonnegative().optional(),
  buildingConstructionTypeId: z.coerce.number().nonnegative().optional(),
  buildingPredominateUseId: z.coerce.number().nonnegative().optional(),
  buildingOccupantTypeId: z.coerce.number().nonnegative().optional(),
  isSensitive: z.coerce.boolean().optional(),
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sort: z.string().optional(),
  includeRelations: z.coerce.boolean().optional(),
});

export type BuildingFilter = z.infer<typeof BuildingFilterSchema>;
