import z from 'zod';

export const errorReportSchema = z.object({
  // Only specified the fields we're using.
  user: z.object({
    client_roles: z.array(z.string()).optional(),
    email: z.string().email(),
    preferred_username: z.string(),
    display_name: z.string(),
  }),
  userMessage: z.string(),
  error: z.object({
    message: z.string(),
    stack: z.string(),
  }),
  timestamp: z.string(),
});

export type ErrorReport = z.infer<typeof errorReportSchema>;
