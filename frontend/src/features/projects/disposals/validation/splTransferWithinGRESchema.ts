import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const dateCheck = (val: any) => typeof val === 'string' && moment(val).isValid();

export const splTransferWithinGRESchema = z
  .object({
    workflowCode: z.nativeEnum(Workflow),
    statusCode: z.nativeEnum(WorkflowStatus),
    transferredWithinGreOn: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.workflowCode === Workflow.SPL &&
        data.statusCode === WorkflowStatus.TransferredGRE &&
        !dateCheck(data.transferredWithinGreOn)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Transferred within GRE on required',
    },
  );
