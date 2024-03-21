import { z } from 'zod';

export const AgencyCreationSchema = z.object({
  createdOn: z.string(),
  updatedOn: z.string(),
  updatedByName: z.string(),
  updatedByEmail: z.string(),
  id: z.number().int(),
  name: z.string(),
  isDisabled: z.boolean(),
  isVisible: z.boolean(),
  sortOrder: z.coerce.number(),
  type: z.string(),
  code: z.string(),
  parentId: z.number().int(),
  description: z.string(),
  email: z.string(),
  ccEmail: z.string(),
  sendEmail: z.string(),
  addressTo: z.string(),
});

export const AgencyFilterSchema = z.object({
  name: z.string().optional(),
  parentId: z.coerce.number().int().optional(),
  isDisabled: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sort: z.string().optional(),
  id: z.coerce.number().optional(),
});

export const AgencyPublicResponseSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  SortOrder: z.number(),
  Code: z.string(),
  Description: z.string().nullable(),
  IsDisabled: z.boolean(),
  ParentId: z.number().int().nullable(),
});

export type Agency = z.infer<typeof AgencyCreationSchema>;
export type AgencyPublicResponse = z.infer<typeof AgencyPublicResponseSchema>;
export type AgencyFilter = z.infer<typeof AgencyFilterSchema>;
