import { z } from 'zod';

export const AdministrativeAreaFilterSchema = z.object({
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sortKey: z.string().optional(),
  sortOrder: z.string().optional(),
  name: z.string().optional(),
  regionalDistrictName: z.string().optional(),
  isDisabled: z.string().optional(),
  createdOn: z.string().optional(),
  quickFilter: z.string().optional(),
});

export const AdministrativeAreaPublicResponseSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  RegionalDistrictName: z.string(),
  ProvinceId: z.string(),
  CreatedOn: z.date(),
});

export type AdministrativeAreaFilter = z.infer<typeof AdministrativeAreaFilterSchema>;
