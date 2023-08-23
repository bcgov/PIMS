import { WorkflowStatus } from 'hooks/api/projects';
import { toInteger } from 'lodash';
import * as yup from 'yup';

// TODO: I was unable to figure out how to to a Yup array schema to support
// only specific array values and provide custom errors for each..
export const documentationSchema = yup.object({
  appraised: yup.string().when(['tasks'], {
    is: (tasks: { isCompleted: any }[]) => {
      return tasks[6].isCompleted;
    },
    then: () =>
      yup
        .string()
        .required('Appraisal value required')
        .test('isValue', 'Appraisal value required', (value) => {
          return !isNaN(toInteger(value));
        })
        .min(0, 'Minimum amount is $0.00'),
  }),
  publicNote: yup.string().when(['statusCode'], {
    is: (statusCode: WorkflowStatus) => {
      return statusCode === WorkflowStatus.Cancelled;
    },
    then: () => yup.string().required('Reason for cancelling required'),
  }),
});
