import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

export const dateCheck = (val: any) =>
  val !== 'invalid-date' && typeof val === 'string' && moment(val).isValid();

export const splApprovalSchema = z
  .object({
    workflowCode: z.nativeEnum(Workflow),
    statusCode: z.nativeEnum(WorkflowStatus),
    requestForSplReceivedOn: z.string().optional(),
    approvedForSplOn: z.string().optional(),
    removalFromSplRequestOn: z.string().optional(),
    removalFromSplApprovedOn: z.string().optional(),
    removalFromSplRationale: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.workflowCode === Workflow.SPL) {
        if (!dateCheck(data.requestForSplReceivedOn) || !dateCheck(data.approvedForSplOn)) {
          return false;
        }
      }

      if (
        (data.workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          data.workflowCode === Workflow.ERP ||
          data.workflowCode === Workflow.SPL) &&
        data.statusCode === WorkflowStatus.NotInSpl
      ) {
        if (
          !dateCheck(data.removalFromSplRequestOn) ||
          !dateCheck(data.removalFromSplApprovedOn) ||
          !data.removalFromSplRationale
        ) {
          return false;
        }
      }

      return true;
    },
    {
      message: 'Required field missing or invalid',
    },
  );
