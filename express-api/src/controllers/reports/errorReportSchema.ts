import z from 'zod';

/**
 * @description Zod schema for validating frontend error reports.
 */
export const errorReportSchema = z.object({
  // Only specified the fields we're using.
  user: z.object({
    client_roles: z.array(z.string()).optional(),
    email: z.string().email(),
    preferred_username: z.string(),
    display_name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  userMessage: z.string(),
  error: z.object({
    message: z.string(),
    stack: z.string(),
  }),
  timestamp: z.string(),
  url: z.string(),
});

/**
 * @description Type inferred from Zod schema errorReportSchema
 * @type ErrorReport
 */
export type ErrorReport = z.infer<typeof errorReportSchema>;
