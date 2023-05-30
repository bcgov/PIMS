import { WorkflowStatus } from 'hooks/api/projects';
import { toInteger } from 'lodash';
import { z } from 'zod';

const AppraisalValue = z
  .string()
  .refine((value) => !isNaN(toInteger(value)), {
    message: 'Appraisal value required',
    path: ['appraised'],
  })
  .refine((value) => toInteger(value) >= 0, {
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
    statusCode: z.enum([WorkflowStatus.Cancelled /* Other status codes... */]), // make sure to include all possible status codes here
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
