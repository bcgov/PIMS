import { WorkflowStatus } from 'hooks/api/projects';
import * as Yup from 'yup';

export const informationProjectSchema = Yup.object({
  projectNumber: Yup.string().required('Project Number required'),
  name: Yup.string().required('Project name required'),
  agencyId: Yup.string().when(['statusCode'], {
    is: (statusCode: WorkflowStatus) => {
      return statusCode !== WorkflowStatus.TransferredGRE;
    },
    then: () =>
      Yup.string().typeError('Project agency required').required('Project agency required').min(1),
  }),
  approvedOn: Yup.date().required('Project approved on required'),
  reportedFiscalYear: Yup.number().min(1).required('Project reported fiscal year required'),
  actualFiscalYear: Yup.number()
    .min(1)
    .required('Project actual or forecasted fiscal year required'),
});
