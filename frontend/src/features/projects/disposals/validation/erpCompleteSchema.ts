import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const workflowEnum = z.enum(Object.keys(Workflow) as any);
const workflowStatusEnum = z.enum(Object.keys(WorkflowStatus) as any);

const OnHoldNotification = z.string().refine((value) => moment(value).isValid(), {
  message: 'On hold notification required',
});

const TransferredWithinGreOn = z.string().refine((value) => moment(value).isValid(), {
  message: 'Transferred within GRE on required',
});

const ClearanceNotification = z.string().refine((value) => moment(value).isValid(), {
  message: 'Clearance notification required',
});

const RequestForSplReceivedOn = z.string().refine((value) => moment(value).isValid(), {
  message: 'Request for SPL received on required',
});

const ApprovedForSplOn = z.string().refine((value) => moment(value).isValid(), {
  message: 'SPL addition approved on required',
});

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
  .refine((data) => {
    if (
      data.workflowCode === Workflow.ERP &&
      (data.statusCode === WorkflowStatus.OnHold ||
        data.statusCode === WorkflowStatus.TransferredGRE) &&
      data.originalStatusCode !== WorkflowStatus.NotInSpl
    ) {
      return OnHoldNotification.safeParse(data.onHoldNotificationSentOn).success;
    }
    return true;
  })
  .refine((data) => {
    if (
      (data.workflowCode === Workflow.ERP ||
        data.workflowCode === Workflow.ASSESS_EXEMPTION ||
        data.workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
      data.statusCode === WorkflowStatus.TransferredGRE &&
      data.originalStatusCode !== WorkflowStatus.NotInSpl
    ) {
      return TransferredWithinGreOn.safeParse(data.transferredWithinGreOn).success;
    }
    return true;
  })
  .refine((data) => {
    if (
      ((data.workflowCode === Workflow.ERP ||
        data.workflowCode === Workflow.ASSESS_EXEMPTION ||
        data.workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
        data.statusCode === WorkflowStatus.NotInSpl) ||
      data.workflowCode === Workflow.SPL ||
      data.statusCode === WorkflowStatus.ApprovedForSpl
    ) {
      return ClearanceNotification.safeParse(data.clearanceNotificationSentOn).success;
    }
    return true;
  })
  .refine((data) => {
    if (data.workflowCode === Workflow.SPL && data.statusCode === WorkflowStatus.ApprovedForSpl) {
      return RequestForSplReceivedOn.safeParse(data.requestForSplReceivedOn).success;
    }
    return true;
  })
  .refine((data) => {
    if (data.workflowCode === Workflow.SPL && data.statusCode === WorkflowStatus.ApprovedForSpl) {
      return ApprovedForSplOn.safeParse(data.approvedForSplOn).success;
    }
    return true;
  });
