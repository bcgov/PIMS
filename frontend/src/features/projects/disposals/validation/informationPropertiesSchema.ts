import { z } from 'zod';

export const informationPropertiesSchema = z.object({
  tierLevelId: z.number().refine((n) => n >= 1 && n <= 4, {
    message: 'Project tier level required',
  }),
  riskId: z.number().refine((n) => n >= 1 && n <= 3, {
    message: 'Project risk required',
  }),
  assessed: z.number().refine((n) => n >= 0, {
    message: 'Project assessed value required. Minimum value is $0.00',
  }),
  market: z.number().refine((n) => n >= 0, {
    message: 'Project estimated market value required. Minimum value is $0.00',
  }),
  netBook: z.number().refine((n) => n >= 0, {
    message: 'Project net book value required. Minimum value is $0.00',
  }),
  properties: z
    .array(
      z.object({
        name: z.string().optional(),
        address: z.string(),
      }),
    )
    .refine((arr) => arr.length > 0, {
      message: 'At least one property must be associated with this project',
    }),
});
