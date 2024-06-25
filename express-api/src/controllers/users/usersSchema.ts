import { z } from 'zod';
import { UUID } from 'crypto';

export const UserFilteringSchema = z.object({
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  email: z.string().optional(),
  agencyId: z.number().optional() || z.array(z.number().int().nonnegative()).optional(),
  agency: z.string().optional(),
  role: z.string().optional(),
  position: z.string().optional(),
  id: z.string().uuid().optional(),
  guid: z.string().uuid().optional(),
  status: z.string().optional(),
  sortOrder: z.string().optional(),
  sortKey: z.string().optional(),
});

export type UserFiltering = z.infer<typeof UserFilteringSchema> & { id?: UUID }; //Kinda hacky, but the type expected in typeorm is more strict than what zod infers here.

export const UserKeycloakInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  realmRoles: z.array(z.string()),
  clientRoles: z.array(z.string()),
  groups: z.array(z.string()),
  agencies: z.array(z.number()),
});

export type User = z.infer<typeof UserKeycloakInfoSchema>;

export const UserReportFilterSchema = z.object({
  page: z.number(),
  quantity: z.number(),
  username: z.string(),
  displayName: z.string(),
  lastName: z.string(),
  firstName: z.string(),
  email: z.string(),
  agency: z.string(),
  role: z.string(),
  position: z.string(),
  isDisabled: z.boolean(),
  sort: z.array(z.string()),
});

export type UserReportFilter = z.infer<typeof UserReportFilterSchema>;

export const UserAccessRequestSchema = z.object({
  createdOn: z.string(),
  updatedOn: z.string(),
  updatedByName: z.string(),
  updatedByEmail: z.string(),
  rowVersion: z.string(),
  id: z.number(),
  userId: z.string(),
  user: z.object({
    createdOn: z.string(),
    updatedOn: z.string(),
    updatedByName: z.string(),
    updatedByEmail: z.string(),
    rowVersion: z.string(),
    id: z.string(),
    username: z.string(),
    displayName: z.string(),
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    email: z.string(),
    position: z.string(),
  }),
  agencies: z.array(
    z.object({
      createdOn: z.string(),
      updatedOn: z.string(),
      updatedByName: z.string(),
      updatedByEmail: z.string(),
      rowVersion: z.string(),
      id: z.number(),
      name: z.string(),
      isDisabled: z.boolean(),
      isVisible: z.boolean(),
      sortOrder: z.number(),
      type: z.string(),
      code: z.string(),
      parentId: z.number(),
      description: z.string(),
    }),
  ),
  status: z.string(),
  roles: z.array(
    z.object({
      createdOn: z.string(),
      updatedOn: z.string(),
      updatedByName: z.string(),
      updatedByEmail: z.string(),
      rowVersion: z.string(),
      id: z.string(),
      name: z.string(),
      isDisabled: z.boolean(),
      isVisible: z.boolean(),
      sortOrder: z.number(),
      type: z.string(),
      description: z.string(),
    }),
  ),
  note: z.string(),
});

export type UserAccessRequest = z.infer<typeof UserAccessRequestSchema>;

const UserCsvSchema = z.object({
  id: z.string(),
  username: z.string(),
  position: z.string(),
  displayName: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  email: z.string(),
  isDisabled: z.boolean(),
  emailVerified: z.boolean(),
  note: z.string(),
  lastLogin: z.string(), // Assuming lastLogin is a string for simplicity, you can use z.date() if it's a Date
  approvedBy: z.string(),
  approvedOn: z.string(), // Assuming approvedOn is a string for simplicity, you can use z.date() if it's a Date
  agencies: z.string(),
  roles: z.string(),
});

export const UserReportCsvSchema = z.object({
  items: z.array(UserCsvSchema),
  page: z.number(),
  quantity: z.number(),
  total: z.number(),
});

export type UserReportCsv = z.infer<typeof UserReportCsvSchema>;
