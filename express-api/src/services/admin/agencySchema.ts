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
  parentId: z.string(),
  description: z.string(),
  email: z.string(),
  ccEmail: z.string(),
  sendEmail: z.string(),
  addressTo: z.string(),
});

//The swagger for the .NET verison was once again misleading about what fields you can filter by.
//This rendition is based off the actual AgencyFilter C# Model.
export const AgencyFilterSchema = AgencyCreationSchema.partial()
  .pick({
    name: true,
    parentId: true,
    isDisabled: true,
    sortOrder: true,
  })
  .extend({
    page: z.coerce.number().optional(),
    quantity: z.coerce.number().optional(),
    sort: z.string().optional(),
    id: z.string().optional(),
  });

export type Agency = z.infer<typeof AgencyCreationSchema>;
export type AgencyFilter = z.infer<typeof AgencyFilterSchema>;
