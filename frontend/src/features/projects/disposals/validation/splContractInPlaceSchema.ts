import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { toInteger } from 'lodash';
import moment from 'moment';
import * as yup from 'yup';

export const splContractInPlaceSchema = yup.object({
  purchaser: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        workflowCode === Workflow.SPL &&
        (statusCode === WorkflowStatus.ContractInPlaceConditional ||
          statusCode === WorkflowStatus.ContractInPlaceUnconditional)
      );
    },
    then: () => yup.string().required('Purchaser required'),
  }),
  offerAmount: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        workflowCode === Workflow.SPL &&
        (statusCode === WorkflowStatus.ContractInPlaceConditional ||
          statusCode === WorkflowStatus.ContractInPlaceUnconditional)
      );
    },
    then: () =>
      yup
        .string()
        .required('Offer amount required')
        .test('isValue', 'Offer amount required', (value) => {
          return !isNaN(toInteger(value));
        })
        .min(0, 'Minimum amount is $0.00'),
  }),
  offerAcceptedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return (
        workflowCode === Workflow.SPL &&
        (statusCode === WorkflowStatus.ContractInPlaceConditional ||
          statusCode === WorkflowStatus.ContractInPlaceUnconditional)
      );
    },
    then: () =>
      yup
        .string()
        .typeError('Offer accepted on required')
        .required('Offer accepted on required')
        .test('isDate', 'Offer accepted on required', (value) => {
          return moment(value).isValid();
        }),
  }),
  disposedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode: Workflow, statusCode: WorkflowStatus) => {
      return workflowCode === Workflow.SPL && statusCode === WorkflowStatus.Disposed;
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
});
