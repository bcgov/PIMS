import { WorkflowStatus } from 'hooks/api/projects';
import { z } from 'zod';

const AppraisalValue = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: 'Appraisal value required',
    path: ['appraised'],
  })
  .refine((value) => Number(value) >= 0, {
    message: 'Minimum amount is $0.00',
    path: ['appraised'],
  });

export const documentationSchema = z
  .object({
    appraised: z.string(),
    publicNote: z.string(),
    tasks: z.array(
      z.object({
        isCompleted: z.boolean(),
      }),
    ),
    statusCode: z.enum([Object.values(WorkflowStatus) as any]),
  })
  .refine((data) => {
    if (data.tasks[6]?.isCompleted) {
      return AppraisalValue.parse(data.appraised);
    }
    return true;
  })
  .refine(
    (data) => {
      if (data.statusCode === WorkflowStatus.Cancelled) {
        return z.string().parse(data.publicNote);
      }
      return true;
    },
    {
      message: 'Reason for cancelling required',
      path: ['publicNote'],
    },
  );
