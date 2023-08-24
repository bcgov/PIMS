import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const erpCompleteSchema = yup.object({
  onHoldNotificationSentOn: yup
    .string()
    .when(['workflowCode', 'statusCode', 'originalStatusCode'], {
      is: (
        workflowCode: Workflow,
        statusCode: WorkflowStatus,
        originalStatusCode: WorkflowStatus,
      ) => {
        return (
          workflowCode === Workflow.ERP &&
          (statusCode === WorkflowStatus.OnHold || statusCode === WorkflowStatus.TransferredGRE) &&
          originalStatusCode !== WorkflowStatus.NotInSpl
        );
      },
      then: () =>
        yup
          .string()
          .typeError('On hold notification required')
          .required('On hold notification required')
          .test('isDate', 'On hold notification required', (value) => {
            return moment(value).isValid();
          }),
    }),
  transferredWithinGreOn: yup.string().when(['workflowCode', 'statusCode', 'originalStatusCode'], {
    is: (
      workflowCode: Workflow,
      statusCode: WorkflowStatus,
      originalStatusCode: WorkflowStatus,
    ) => {
      return (
        (workflowCode === Workflow.ERP ||
          workflowCode === Workflow.ASSESS_EXEMPTION ||
          workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
        statusCode === WorkflowStatus.TransferredGRE &&
        originalStatusCode !== WorkflowStatus.NotInSpl
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Transferred within GRE on required')
        .required('Transferred within GRE on required')
        .test('isDate', 'Transferred within GRE on required', (value) => {
          return moment(value).isValid();
        }),
  }),
  clearanceNotificationSentOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        ((workflowCode === Workflow.ERP ||
          workflowCode === Workflow.ASSESS_EXEMPTION ||
          workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
          statusCode === WorkflowStatus.NotInSpl) ||
        workflowCode === Workflow.SPL ||
        statusCode === WorkflowStatus.ApprovedForSpl
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Clearance notification required')
        .required('Clearance notification required')
        .test('isDate', 'Clearance notification required', (value) => {
          return moment(value).isValid();
        }),
  }),
  requestForSplReceivedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.ApprovedForSpl;
    },
    then: () =>
      yup
        .string()
        .typeError('Request for SPL received on required')
        .required('Request for SPL received on required')
        .test('isDate', 'Request for SPL received on required', (value) => {
          return moment(value).isValid();
        }),
  }),
  approvedForSplOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.ApprovedForSpl;
    },
    then: () =>
      yup
        .string()
        .typeError('SPL addition approved on required')
        .required('SPL addition approved on required')
        .test('isDate', 'SPL addition approved on required', (value) => {
          return moment(value).isValid();
        }),
  }),
});
