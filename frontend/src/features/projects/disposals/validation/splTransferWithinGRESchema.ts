import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const splTransferWithinGRESchema = yup.object({
  transferredWithinGreOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.TransferredGRE;
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
