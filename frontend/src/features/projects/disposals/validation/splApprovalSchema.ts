import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const splApprovalSchema = yup.object({
  requestForSplReceivedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow) => {
      return workflowCode === Workflow.SPL;
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
    is: (workflowCode: Workflow) => {
      return workflowCode === Workflow.SPL;
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
  removalFromSplRequestOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        (workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          workflowCode === Workflow.ERP ||
          workflowCode === Workflow.SPL) &&
        statusCode === WorkflowStatus.NotInSpl
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Remove from SPL requested date required')
        .required('Remove from SPL requested date require')
        .test('isDate', 'Remove from SPL requested date require', (value) => {
          return moment(value).isValid();
        }),
  }),
  removalFromSplApprovedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        (workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          workflowCode === Workflow.ERP ||
          workflowCode === Workflow.SPL) &&
        statusCode === WorkflowStatus.NotInSpl
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Remove from SPL approved on date required')
        .required('Remove from SPL approved on date require')
        .test('isDate', 'Remove from SPL approved on date require', (value) => {
          return moment(value).isValid();
        }),
  }),
  removalFromSplRationale: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        (workflowCode === Workflow.ASSESS_EX_DISPOSAL ||
          workflowCode === Workflow.ERP ||
          workflowCode === Workflow.SPL) &&
        statusCode === WorkflowStatus.NotInSpl
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Remove from SPL rationale required')
        .required('Remove from SPL rationale require'),
  }),
});
