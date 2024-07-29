import { z } from 'zod';

const NotificationSchema = z.object({
  createdOn: z.string(),
  updatedOn: z.string(),
  updatedByName: z.string(),
  updatedByEmail: z.string(),
  rowVersion: z.string(),
  id: z.number(),
  key: z.string(),
  status: z.string(),
  priority: z.string(),
  encoding: z.string(),
  bodyType: z.string(),
  sendOn: z.string(),
  to: z.string(),
  bcc: z.string(),
  cc: z.string(),
  subject: z.string(),
  body: z.string(),
  tag: z.string(),
  projectId: z.number(),
  toAgencyId: z.number(),
  chesMessageId: z.string(),
  chesTransactionId: z.string(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationResponseSchema = z.object({
  items: z.array(NotificationSchema),
  page: z.number(),
  quantity: z.number(),
  total: z.number(),
});

export const DisposalNotificationFilterSchema = z.object({
  page: z.number().optional(),
  quantity: z.number().optional(),
  sort: z.array(z.string()).optional(),
  projectNumber: z.string().optional(),
  projectId: z.coerce.number(),
  agencyId: z.coerce.number().optional(),
  tag: z.string().optional(),
  status: z.array(z.string()).optional(),
  to: z.string().optional(),
  subject: z.string().optional(),
});

export type DisposalNotificationFilter = z.infer<typeof DisposalNotificationFilterSchema>;

const NotificationQueueFilterSchema = z.object({
  page: z.number(),
  quantity: z.number(),
  sort: z.array(z.string()),
  key: z.string(),
  status: z.string(),
  minSendOn: z.string(),
  maxSendOn: z.string(),
  to: z.string(),
  tag: z.string(),
  subject: z.string(),
  body: z.string(),
  projectId: z.number(),
  projectNumber: z.string(),
  agencyId: z.number(),
});

export type NotificationQueueFilter = z.infer<typeof NotificationQueueFilterSchema>;

const StatusSchema = z.object({
  id: z.number(),
  fromStatusId: z.number(),
  fromStatus: z.string(),
  toStatusId: z.number(),
  toStatus: z.string(),
  priority: z.string(),
  delay: z.string(),
  delayDays: z.number(),
});

export const NotificationTemplateSchema = z.object({
  createdOn: z.string(),
  updatedOn: z.string(),
  updatedByName: z.string(),
  updatedByEmail: z.string(),
  rowVersion: z.string(),
  id: z.number(),
  name: z.string(),
  description: z.string(),
  to: z.string(),
  cc: z.string(),
  bcc: z.string(),
  audience: z.string(),
  encoding: z.string(),
  bodyType: z.string(),
  priority: z.string(),
  subject: z.string(),
  body: z.string(),
  isDisabled: z.boolean(),
  tag: z.string(),
  status: z.array(StatusSchema),
});

export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;
