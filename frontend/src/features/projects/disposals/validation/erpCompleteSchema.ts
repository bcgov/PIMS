import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const erpCompleteSchema = yup.object({
  onHoldNotificationSentOn: yup
    .string()
    .when(['workflowCode', 'statusCode', 'originalStatusCode'], {
      is: (workflowCode, statusCode, originalStatusCode) => {
        return (
          workflowCode === Workflow.ERP &&
          (statusCode === WorkflowStatus.OnHold || statusCode === WorkflowStatus.TransferredGRE) &&
          originalStatusCode !== WorkflowStatus.NotInSpl
        );
      },
      then: yup
        .string()
        .typeError('On hold notification required')
        .required('On hold notification required')
        .test('isDate', 'On hold notification required', value => {
          return moment(value).isValid();
        }),
    }),
  transferredWithinGreOn: yup.string().when(['workflowCode', 'statusCode', 'originalStatusCode'], {
    is: (workflowCode, statusCode, originalStatusCode) => {
      return (
        (workflowCode === Workflow.ERP ||
          workflowCode === Workflow.ASSESS_EXEMPTION ||
          workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
        statusCode === WorkflowStatus.TransferredGRE &&
        originalStatusCode !== WorkflowStatus.NotInSpl
      );
    },
    then: yup
      .string()
      .typeError('Transferred within GRE on required')
      .required('Transferred within GRE on required')
      .test('isDate', 'Transferred within GRE on required', value => {
        return moment(value).isValid();
      }),
  }),
  clearanceNotificationSentOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return (
        ((workflowCode === Workflow.ERP ||
          workflowCode === Workflow.ASSESS_EXEMPTION ||
          workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
          statusCode === WorkflowStatus.NotInSpl) ||
        workflowCode === Workflow.SPL ||
        statusCode === WorkflowStatus.ApprovedForSpl
      );
    },
    then: yup
      .string()
      .typeError('Clearance notification required')
      .required('Clearance notification required')
      .test('isDate', 'Clearance notification required', value => {
        return moment(value).isValid();
      }),
  }),
  requestForSplReceivedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.ApprovedForSpl;
    },
    then: yup
      .string()
      .typeError('Request for SPL received on required')
      .required('Request for SPL received on required')
      .test('isDate', 'Request for SPL received on required', value => {
        return moment(value).isValid();
      }),
  }),
  approvedForSplOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.ApprovedForSpl;
    },
    then: yup
      .string()
      .typeError('SPL addition approved on required')
      .required('SPL addition approved on required')
      .test('isDate', 'SPL addition approved on required', value => {
        return moment(value).isValid();
      }),
  }),
  removalFromSplRequestOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return (
        (workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          workflowCode === Workflow.ERP ||
          workflowCode === Workflow.SPL) &&
        statusCode === WorkflowStatus.NotInSpl
      );
    },
    then: yup
      .string()
      .typeError('Not in SPL requested date required')
      .required('Not in SPL requested date require')
      .test('isDate', 'Not in SPL requested date require', value => {
        return moment(value).isValid();
      }),
  }),
  removalFromSplApprovedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return (
        (workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          workflowCode === Workflow.ERP ||
          workflowCode === Workflow.SPL) &&
        statusCode === WorkflowStatus.NotInSpl
      );
    },
    then: yup
      .string()
      .typeError('Not in SPL approved on date required')
      .required('Not in SPL approved on date require')
      .test('isDate', 'Not in SPL approved on date require', value => {
        return moment(value).isValid();
      }),
  }),
  removalFromSplRationale: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return (
        (workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          workflowCode === Workflow.ERP ||
          workflowCode === Workflow.SPL) &&
        statusCode === WorkflowStatus.NotInSpl
      );
    },
    then: yup
      .string()
      .typeError('Not in SPL rationale required')
      .required('Not in SPL rationale require'),
  }),
});
