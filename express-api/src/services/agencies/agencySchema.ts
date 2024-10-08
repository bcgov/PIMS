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
  parentName: z.string().optional(),
  isDisabled: z.string().optional(),
  email: z.string().optional(),
  sendEmail: z.string().optional(),
  updatedOn: z.string().optional(),
  createdOn: z.string().optional(),
  code: z.string().optional(),
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sortKey: z.string().optional(),
  sortOrder: z.string().optional(),
  quickFilter: z.string().optional(),
});

export const AgencyPublicResponseSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  SortOrder: z.number(),
  Code: z.string(),
  Description: z.string().optional(),
  IsDisabled: z.boolean(),
  ParentId: z.number().int().optional(),
  ParentName: z.string().optional(),
});

export type Agency = z.infer<typeof AgencyCreationSchema>;
export type AgencyPublicResponse = z.infer<typeof AgencyPublicResponseSchema>;
export type AgencyFilter = z.infer<typeof AgencyFilterSchema>;
