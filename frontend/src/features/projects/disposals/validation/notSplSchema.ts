import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const notSplSchema = yup.object({
  disposedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        (workflowCode === Workflow.ERP || workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
        statusCode === WorkflowStatus.Disposed
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Disposal date required')
        .required('Disposal date required')
        .test('isDate', 'Disposal date required', (value) => {
          return moment(value).isValid();
        }),
  }),
  transferredWithinGreOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: string, statusCode: WorkflowStatus) => {
      return statusCode === WorkflowStatus.TransferredGRE;
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
});
