import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const workflowEnum = z.enum(Object.values(Workflow) as any);
const workflowStatusEnum = z.enum(Object.values(WorkflowStatus) as any);

export const erpCompleteSchema = z
  .object({
    onHoldNotificationSentOn: z.string(),
    transferredWithinGreOn: z.string(),
    clearanceNotificationSentOn: z.string(),
    requestForSplReceivedOn: z.string(),
    approvedForSplOn: z.string(),
    workflowCode: workflowEnum,
    statusCode: workflowStatusEnum,
    originalStatusCode: workflowStatusEnum,
  })
  .superRefine((data, ctx) => {
    console.log('HERE', data.clearanceNotificationSentOn);
    const isErpWorkflow = data.workflowCode === Workflow.ERP;
    const isAssessExemptionWorkflow = data.workflowCode === Workflow.ASSESS_EXEMPTION;
    const isAssessExDisposalWorkflow = data.workflowCode === Workflow.ASSESS_EX_DISPOSAL;
    const isSplWorkflow = data.workflowCode === Workflow.SPL;

    if (
      isErpWorkflow &&
      (data.statusCode === WorkflowStatus.OnHold ||
        data.statusCode === WorkflowStatus.TransferredGRE) &&
      data.originalStatusCode !== WorkflowStatus.NotInSpl
    ) {
      validateDate(data.onHoldNotificationSentOn, 'On hold notification required');
    }

    if (
      (isErpWorkflow || isAssessExemptionWorkflow || isAssessExDisposalWorkflow) &&
      data.statusCode === WorkflowStatus.TransferredGRE &&
      data.originalStatusCode !== WorkflowStatus.NotInSpl
    ) {
      validateDate(data.transferredWithinGreOn, 'Transferred within GRE on required');
    }

    if (
      ((isErpWorkflow || isAssessExemptionWorkflow || isAssessExDisposalWorkflow) &&
        data.statusCode === WorkflowStatus.NotInSpl) ||
      isSplWorkflow ||
      data.statusCode === WorkflowStatus.ApprovedForSpl
    ) {
      validateDate(data.clearanceNotificationSentOn, 'Clearance notification required');
    }

    if (isSplWorkflow && data.statusCode === WorkflowStatus.ApprovedForSpl) {
      validateDate(data.requestForSplReceivedOn, 'Request for SPL received on required');
      validateDate(data.approvedForSplOn, 'SPL addition approved on required');
    }

    function validateDate(date: string, message: string) {
      if (!moment(date).isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message,
        });
      }
    }
  });
