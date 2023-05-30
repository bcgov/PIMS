import { WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const workflowStatusEnum = z.enum(Object.keys(WorkflowStatus) as any);

export const informationProjectSchema = z
  .object({
    projectNumber: z.string(),
    name: z.string(),
    agencyId: z.string().optional(),
    statusCode: workflowStatusEnum,
    approvedOn: z.string(),
    reportedFiscalYear: z.number(),
    actualFiscalYear: z.number(),
  })
  .refine(
    (data) => {
      return !(data.statusCode !== WorkflowStatus.TransferredGRE && !data.agencyId);
    },
    {
      message: 'Project agency required',
    },
  )
  .refine((data) => data.projectNumber.length > 0, {
    message: 'Project Number required',
    path: ['projectNumber'],
  })
  .refine((data) => data.name.length > 0, {
    message: 'Project name required',
    path: ['name'],
  })
  .refine((data) => moment(data.approvedOn, 'YYYY-MM-DD', true).isValid(), {
    message: 'Project approved on required',
    path: ['approvedOn'],
  })
  .refine((data) => data.reportedFiscalYear >= 1, {
    message: 'Project reported fiscal year required',
    path: ['reportedFiscalYear'],
  })
  .refine((data) => data.actualFiscalYear >= 1, {
    message: 'Project actual or forecasted fiscal year required',
    path: ['actualFiscalYear'],
  });
