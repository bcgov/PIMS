import { z } from 'zod';

export const AdministrativeAreaFilterSchema = z.object({
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sortKey: z.string().optional(),
  sortOrder: z.string().optional(),
  sortRelation: z.string().optional(),
  name: z.string().optional(),
  provinceId: z.string().optional(),
  regionalDistrict: z.string().optional(),
});

export const AdministrativeAreaPublicResponseSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  ProvinceId: z.string(),
  CreatedOn: z.date(),
});

export type AdministrativeAreaFilter = z.infer<typeof AdministrativeAreaFilterSchema>;
