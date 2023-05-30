import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const dateCheck = (val: any) => typeof val === 'string' && moment(val).isValid();

export const notSplSchema = z
  .object({
    workflowCode: z.nativeEnum(Workflow),
    statusCode: z.nativeEnum(WorkflowStatus),
    disposedOn: z.string().optional(),
    transferredWithinGreOn: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        (data.workflowCode === Workflow.ERP || data.workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
        data.statusCode === WorkflowStatus.Disposed
      ) {
        return dateCheck(data.disposedOn);
      } else if (data.statusCode === WorkflowStatus.TransferredGRE) {
        return dateCheck(data.transferredWithinGreOn);
      }
      return true;
    },
    {
      message: 'Disposal date or Transferred within GRE on required',
    },
  );
