import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import moment from 'moment';
import { z } from 'zod';

const workflowEnum = z.enum(Object.values(Workflow) as any);
const workflowStatusEnum = z.enum(Object.values(WorkflowStatus) as any);

const OfferAmount = z
  .string()
  .refine((value) => !isNaN(parseInt(value)), 'Offer amount required')
  .refine((value) => parseInt(value) >= 0, 'Minimum amount is $0.00');

const OfferAcceptedOn = z
  .string()
  .refine((value) => moment(value).isValid(), 'Offer accepted on required');

const DisposedOn = z.string().refine((value) => moment(value).isValid(), 'Disposal date required');

export const erpDisposedSchema = z
  .object({
    purchaser: z.string().optional(),
    offerAmount: z.string().optional(),
    offerAcceptedOn: z.string().optional(),
    disposedOn: z.string().optional(),
    workflowCode: workflowEnum,
    statusCode: workflowStatusEnum,
  })
  .refine(
    (data) => {
      if (data.workflowCode === Workflow.ERP && data.statusCode === WorkflowStatus.Disposed) {
        // Here we use the parse method to check if the data is valid
        // We only care if it throws an error, so we ignore the result
        try {
          z.object({
            purchaser: z.string(),
            offerAmount: OfferAmount,
            offerAcceptedOn: OfferAcceptedOn,
            disposedOn: DisposedOn,
          }).parse({
            purchaser: data.purchaser,
            offerAmount: data.offerAmount,
            offerAcceptedOn: data.offerAcceptedOn,
            disposedOn: data.disposedOn,
          });
        } catch {
          // If the parse method throws an error, the data is invalid
          return false;
        }
      }
      return true;
    },
    {
      message: 'Invalid data',
    },
  );
