import {
  IProjectAgencyResponse,
  IProjectNote,
  IProjectStatusHistory,
  IProjectTask,
  IProperty,
  IStatus,
} from '.';

export interface IProject {
  id?: number;
  projectNumber: string;
  name: string;
  description: string;
  fiscalYear: number;
  properties: IProperty[];
  projectAgencyResponses: IProjectAgencyResponse[];
  note: string;
  notes: IProjectNote[];
  publicNote: string;
  privateNote: string;
  offersNote?: string;
  agencyId: number;
  agency?: string;
  subAgency?: string;
  agencyName?: string;
  statusId: number;
  status?: IStatus;
  exemptionRequested?: boolean;
  exemptionRationale?: string;
  exemptionApprovedOn?: Date | string;
  statusCode?: string;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
  confirmation?: boolean;
  approvedOn?: Date | string;
  deniedOn?: Date | string;
  cancelledOn?: Date | string;
  submittedOn?: Date | string;
  documentationNote?: string;
  initialNotificationSentOn?: Date | string;
  thirtyDayNotificationSentOn?: Date | string;
  sixtyDayNoficationSentOn?: Date | string;
  ninetyDayNotificationSentOn?: Date | string;
  onHoldNotificationSentOn?: Date | string;
  interestedReceivedOn?: Date | string;
  interestFromEnhancedReferralNote?: string;
  transferredWithinGreOn?: Date | string;
  clearanceNotificationSentOn?: Date | string;
  requestForSplReceivedOn?: Date | string;
  approvedForSplOn?: Date | string;
  marketedOn?: Date | string;
  disposedOn?: Date | string;
  assessedOn?: Date | string;
  adjustedOn?: Date | string;
  offerAcceptedOn?: Date | string;
  preliminaryFormSignedOn?: Date | string;
  finalFormSignedOn?: Date | string;
  netBook?: number | '';
  assessed?: number | '';
  appraised?: number | '';
  market?: number | '';
  workflowCode?: string;
  purchaser?: string;
  manager?: string;
  actualFiscalYear?: string;
  plannedFutureUse?: string;
  preliminaryFormSignedBy?: string;
  finalFormSignedBy?: string;
  offerAmount?: number | '';
  interestComponent?: number | '';
  loanTermsNote?: string;
  ocgFinancialStatement?: number | '';
  salesCost?: number | '';
  gainBeforeSpl?: number | '';
  netProceeds?: number | '';
  gainNote?: string;
  programCost?: number | '';
  programCostNote?: string;
  priorYearAdjustmentAmount?: number | '';
  remediationNote?: string;
  adjustmentNote?: string;
  closeOutNote?: string;
  salesHistoryNote?: string;
  comments?: string;
  removalFromSplRequestOn?: Date | string;
  removalFromSplApprovedOn?: Date | string;
  removalFromSplRationale?: string;
  sendNotifications?: boolean;
  statusHistory: IProjectStatusHistory[];
}
