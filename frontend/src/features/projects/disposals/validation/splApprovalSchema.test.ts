import { Workflow, WorkflowStatus } from 'hooks/api/projects';

import { splApprovalSchema } from './splApprovalSchema';

describe('splApprovalSchema', () => {
  it('validates correctly when workflowCode is SPL', async () => {
    const validObject = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.Draft,
      requestForSplReceivedOn: '2023-12-31T23:59:59Z',
      approvedForSplOn: '2023-12-31T23:59:59Z',
    };
    expect(splApprovalSchema.safeParse(validObject).success).toBe(true);
  });

  it('throws validation error when dates are not valid and workflowCode is SPL', async () => {
    const invalidObject = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.Draft,
      requestForSplReceivedOn: 'invalid-date',
      approvedForSplOn: 'invalid-date',
    };
    expect(splApprovalSchema.safeParse(invalidObject).success).toBe(false);
  });

  it('validates correctly when removal from SPL is requested', async () => {
    const validObject = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.NotInSpl,
      requestForSplReceivedOn: '2023-12-31T23:59:59Z',
      approvedForSplOn: '2023-12-31T23:59:59Z',
      removalFromSplRequestOn: '2023-12-31T23:59:59Z',
      removalFromSplApprovedOn: '2023-12-31T23:59:59Z',
      removalFromSplRationale: 'Some rationale',
    };
    expect(splApprovalSchema.safeParse(validObject).success).toBe(true);
  });

  it('throws validation error when removal fields are not valid and removal from SPL is requested', async () => {
    const invalidObject = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.NotInSpl,
      removalFromSplRequestOn: 'invalid-date',
      removalFromSplApprovedOn: 'invalid-date',
      removalFromSplRationale: '',
    };
    expect(splApprovalSchema.safeParse(invalidObject).success).toBe(false);
  });

  it('should fail validation when all fields are missing', async () => {
    const invalidData = {};
    expect(splApprovalSchema.safeParse(invalidData).success).toBe(false);
  });

  it('should fail validation when status is unexpected', async () => {
    const invalidData = {
      workflowCode: Workflow.SPL,
      statusCode: 'UnexpectedStatus',
    };
    expect(splApprovalSchema.safeParse(invalidData).success).toBe(false);
  });

  it('should pass validation for boundary conditions', async () => {
    const validData = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.NotInSpl,
      requestForSplReceivedOn: '2023-12-31T23:59:59Z',
      approvedForSplOn: '2023-12-31T23:59:59Z',
      removalFromSplRequestOn: '2023-12-31T23:59:59Z',
      removalFromSplApprovedOn: '2023-12-31T23:59:59Z',
      removalFromSplRationale: 'A',
    };
    expect(splApprovalSchema.safeParse(validData).success).toBe(true);
  });

  it('should fail validation for invalid types', async () => {
    const invalidData = {
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.NotInSpl,
      requestForSplReceivedOn: 1234567890,
      approvedForSplOn: '2023-12-31T23:59:59Z',
      removalFromSplRequestOn: '2023-12-31T23:59:59Z',
      removalFromSplApprovedOn: '2023-12-31T23:59:59Z',
      removalFromSplRationale: 'A',
    };
    expect(splApprovalSchema.safeParse(invalidData).success).toBe(false);
  });

  it('should handle different workflows', async () => {
    const validData = {
      workflowCode: Workflow.ASSESS_EX_DISPOSAL,
      statusCode: WorkflowStatus.NotInSpl,
      requestForSplReceivedOn: '2023-12-31T23:59:59Z',
      approvedForSplOn: '2023-12-31T23:59:59Z',
      removalFromSplRequestOn: '2023-12-31T23:59:59Z',
      removalFromSplApprovedOn: '2023-12-31T23:59:59Z',
      removalFromSplRationale: 'A',
    };
    expect(splApprovalSchema.safeParse(validData).success).toBe(true);

    validData.workflowCode = Workflow.ERP;
    expect(splApprovalSchema.safeParse(validData).success).toBe(true);
  });
});
