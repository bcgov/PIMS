import { Workflow, WorkflowStatus } from 'hooks/api/projects';

import { splContractInPlaceSchema } from './splContractInPlaceSchema';

describe('splContractInPlaceSchema', () => {
  it('valid data for SPL Contract In Place Conditional', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.ContractInPlaceConditional,
      purchaser: 'John Doe',
      offerAmount: '100000',
      offerAcceptedOn: '2023-06-17',
      disposedOn: '2023-06-29',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('valid data for SPL Contract In Place Unconditional', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.ContractInPlaceConditional,
      purchaser: 'John Doe',
      offerAmount: '100000',
      offerAcceptedOn: '2023-06-17',
      disposedOn: '2023-06-29',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('valid data for SPL Disposed', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.Disposed,
      disposedOn: '2023-06-29',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('invalid data for SPL Contract In Place Conditional - missing purchaser', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.ContractInPlaceConditional,
      offerAmount: '100000',
      offerAcceptedOn: '2023-06-17',
      disposedOn: '2023-06-29',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Required field missing or invalid');
    }
  });

  it('invalid data for SPL Contract In Place Conditional - invalid offerAmount', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.ContractInPlaceConditional,
      purchaser: 'John Doe',
      offerAmount: 'invalid-date',
      offerAcceptedOn: '2023-06-17',
      disposedOn: '2023-06-29',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Required field missing or invalid');
    }
  });

  it('invalid data for SPL Contract In Place Conditional - invalid offerAcceptedOn', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.ContractInPlaceConditional,
      purchaser: 'John Doe',
      offerAmount: '100000',
      offerAcceptedOn: 'invalid-date',
      disposedOn: '2023-06-29',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Required field missing or invalid');
    }
  });

  it('invalid data for SPL Disposed - invalid disposedOn', () => {
    const data = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.Disposed,
      disposedOn: 'invalid-date',
    };

    const result = splContractInPlaceSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Required field missing or invalid');
    }
  });
});
