import { WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const workflowStatusEnum = z.enum(Object.values(WorkflowStatus) as any);

export const informationProjectSchema = z
  .object({
    projectNumber: z.string().refine((value) => value.length > 0, 'Project Number required'),
    name: z.string().refine((value) => value.length > 0, 'Project name required'),
    agencyId: z.string().optional(),
    statusCode: workflowStatusEnum,
    approvedOn: z
      .string()
      .refine(
        (value) => moment(value, 'YYYY-MM-DD', true).isValid(),
        'Project approved on required',
      ),
    reportedFiscalYear: z
      .number()
      .refine((value) => value >= 1, 'Project reported fiscal year required'),
    actualFiscalYear: z
      .number()
      .refine((value) => value >= 1, 'Project actual or forecasted fiscal year required'),
  })
  .refine((data) => {
    return !(data.statusCode !== WorkflowStatus.TransferredGRE && !data.agencyId);
  }, 'Project agency required');
