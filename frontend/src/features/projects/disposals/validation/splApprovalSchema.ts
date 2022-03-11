import { Workflow } from 'hooks/api/projects';
import moment from 'moment';
import * as yup from 'yup';

export const splApprovalSchema = yup.object({
  requestForSplReceivedOn: yup.string().when(['workflowCode', 'statusCode'], {
    is: (workflowCode, statusCode) => {
      return workflowCode === Workflow.SPL;
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
      return workflowCode === Workflow.SPL;
    },
    then: yup
      .string()
      .typeError('SPL addition approved on required')
      .required('SPL addition approved on required')
      .test('isDate', 'SPL addition approved on required', value => {
        return moment(value).isValid();
      }),
  }),
});
