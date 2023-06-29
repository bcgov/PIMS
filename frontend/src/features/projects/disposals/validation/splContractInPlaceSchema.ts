import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const dateCheck = (val: any) =>
  val !== 'invalid-date' && typeof val === 'string' && moment(val).isValid();

const numberCheck = (val: any) => !isNaN(parseInt(val)) && parseInt(val) >= 0;

export const splContractInPlaceSchema = z
  .object({
    workflowCode: z.nativeEnum(Workflow),
    statusCode: z.nativeEnum(WorkflowStatus),
    purchaser: z.string().optional(),
    offerAmount: z.string().optional(),
    offerAcceptedOn: z.string().optional(),
    disposedOn: z.string().optional(),
  })
  .refine((data) => {
    if (
      data.workflowCode === Workflow.SPL &&
      (data.statusCode === WorkflowStatus.ContractInPlaceConditional ||
        data.statusCode === WorkflowStatus.ContractInPlaceUnconditional)
    ) {
      if (!data.purchaser || !numberCheck(data.offerAmount) || !dateCheck(data.offerAcceptedOn)) {
        return false;
      }
    }

    if (data.workflowCode === Workflow.SPL && data.statusCode === WorkflowStatus.Disposed) {
      if (!dateCheck(data.disposedOn)) {
        return false;
      }
    }

    return true;
  }, 'Required field missing or invalid');
