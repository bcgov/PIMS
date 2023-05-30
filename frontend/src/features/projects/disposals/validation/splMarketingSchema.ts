import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const dateCheck = (val: any) => typeof val === 'string' && moment(val).isValid();

export const splMarketingSchema = z
  .object({
    workflowCode: z.nativeEnum(Workflow),
    statusCode: z.nativeEnum(WorkflowStatus),
    marketedOn: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.workflowCode === Workflow.SPL &&
        data.statusCode === WorkflowStatus.OnMarket &&
        !dateCheck(data.marketedOn)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Date entered market on required',
    },
  );
