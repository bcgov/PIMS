import { Workflow, WorkflowStatus } from 'hooks/api/projects';

import { erpCompleteSchema } from './erpCompleteSchema';

describe('erpCompleteSchema', () => {
  it('valid data for ERP workflow on hold', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ERP,
      statusCode: WorkflowStatus.OnHold,
      originalStatusCode: WorkflowStatus.NotInSpl,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('valid data for ERP workflow, status TransferredGRE', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ERP,
      statusCode: WorkflowStatus.TransferredGRE,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('valid data for ERP workflow, status NotInSpl', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ERP,
      statusCode: WorkflowStatus.NotInSpl,
      originalStatusCode: WorkflowStatus.ApprovedForErp,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('valid data for ASSESS_EXEMPTION workflow, status NotInSpl', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ASSESS_EXEMPTION,
      statusCode: WorkflowStatus.NotInSpl,
      originalStatusCode: WorkflowStatus.ApprovedForErp,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('valid data for ASSESS_EX_DISPOSAL workflow, status NotInSpl', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ASSESS_EX_DISPOSAL,
      statusCode: WorkflowStatus.NotInSpl,
      originalStatusCode: WorkflowStatus.ApprovedForErp,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('invalid data for ERP workflow on hold without on hold notification', () => {
    const data = {
      onHoldNotificationSentOn: '',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ERP,
      statusCode: WorkflowStatus.OnHold,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      console.log('HERE', result.error?.errors);
      expect(result.error?.errors[0].message).toBe('On hold notification required');
    }
  });

  it('invalid data for ERP workflow, status TransferredGRE without transferredWithinGreOn', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '', // Empty string
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ERP,
      statusCode: WorkflowStatus.TransferredGRE,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Transferred within GRE on required');
    }
  });

  it('invalid data for ERP workflow, status NotInSpl without clearanceNotificationSentOn', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '', // Empty string
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ERP,
      statusCode: WorkflowStatus.NotInSpl,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Clearance notification required');
    }
  });

  it('invalid data for ASSESS_EXEMPTION workflow, status NotInSpl without clearanceNotificationSentOn', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '', // Empty string
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ASSESS_EXEMPTION,
      statusCode: WorkflowStatus.NotInSpl,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Clearance notification required');
    }
  });

  it('invalid data for ASSESS_EX_DISPOSAL workflow, status NotInSpl without clearanceNotificationSentOn', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '', // Empty string
      requestForSplReceivedOn: '2023-06-17',
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.ASSESS_EX_DISPOSAL,
      statusCode: WorkflowStatus.NotInSpl,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Clearance notification required');
    }
  });

  it('invalid data for SPL workflow, status ApprovedForSpl without requestForSplReceivedOn', () => {
    const data = {
      onHoldNotificationSentOn: '2023-06-20',
      transferredWithinGreOn: '2023-06-19',
      clearanceNotificationSentOn: '2023-06-18',
      requestForSplReceivedOn: '', // Empty string
      approvedForSplOn: '2023-06-16',
      workflowCode: Workflow.SPL,
      statusCode: WorkflowStatus.ApprovedForSpl,
      originalStatusCode: WorkflowStatus.Approval,
    };

    const result = erpCompleteSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error?.errors[0].message).toBe('Request for SPL received on required');
    }
  });
});
