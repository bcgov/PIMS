import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const splMarketingSchema = yup.object({
  marketedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.OnMarket;
    },
    then: () =>
      yup
        .string()
        .typeError('Date entered market on required')
        .required('Date entered market on required')
        .test('isDate', 'Date entered market on required', (value) => {
          return moment(value).isValid();
        }),
  }),
});
