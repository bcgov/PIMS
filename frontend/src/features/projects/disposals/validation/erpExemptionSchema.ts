import { z } from 'zod';

export const erpExemptionSchema = z
  .object({
    exemptionRequested: z.boolean(),
    exemptionRationale: z.string().optional(),
  })
  .refine(
    (data) => {
      // If exemptionRequested is true, exemptionRationale is required
      return !(data.exemptionRequested === true && !data.exemptionRationale);
    },
    {
      message: 'Exemption rationale required',
    },
  );
