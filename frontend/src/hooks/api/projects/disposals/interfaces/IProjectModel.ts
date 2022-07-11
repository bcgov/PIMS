import { IBaseModel } from 'hooks/api/interfaces';

import {
  IProjectAgencyResponseModel,
  IProjectNoteModel,
  IProjectPropertyModel,
  IProjectStatusHistoryModel,
  IProjectStatusModel,
  IProjectTaskModel,
} from '.';

export interface IProjectModel extends IBaseModel {
  id: number;
  projectNumber: string;
  name: string;
  description?: string;
  reportedFiscalYear: number;
  actualFiscalYear: number;
  manager?: string;
  sendNotifications: boolean;
  workflowId: number;
  workflowCode?: string;
  statusId: number;
  statusCode?: string;
  status?: IProjectStatusModel;
  riskId: number;
  risk?: string;
  tierLevelId: number;
  tierLevel?: string;
  note?: string;
  publicNote?: string;
  privateNote?: string;
  appraisedNote?: string;
  offersNote?: string;
  reportingNote?: string;
  purchaser?: string;
  isContractConditional?: boolean;
  agencyId: number;
  agency?: string;
  agencyCode?: string;
  subAgency?: string;
  subAgencyCode?: string;
  submittedOn?: Date;
  approvedOn?: Date;
  deniedOn?: Date;
  cancelledOn?: Date;
  initialNotificationSentOn?: Date;
  thirtyDayNotificationSentOn?: Date;
  sixtyDayNotificationSentOn?: Date;
  ninetyDayNotificationSentOn?: Date;
  onHoldNotificationSentOn?: Date;
  transferredWithinGreOn?: Date;
  clearanceNotificationSentOn?: Date;
  interestedReceivedOn?: Date;
  interestFromEnhancedReferralNote?: string;
  requestForSplReceivedOn?: Date;
  approvedForSplOn?: Date;
  marketedOn?: Date;
  disposedOn?: Date;
  offerAcceptedOn?: Date;
  assessedOn?: Date;
  adjustedOn?: Date;
  preliminaryFormSignedOn?: Date;
  finalFormSignedOn?: Date;
  priorYearAdjustmentOn?: Date;
  exemptionRequested: boolean;
  exemptionRationale?: string;
  exemptionApprovedOn?: Date;
  netBook?: number;
  market?: number;
  appraised?: number;
  assessed?: number;
  salesCost?: number;
  netProceeds?: number;
  programCost?: number;
  programCostNote?: string;
  gainLoss?: number;
  gainNote?: string;
  sppCapitalization?: number;
  gainBeforeSpl?: number;
  ocgFinancialStatement?: number;
  interestComponent?: number;
  loanTermsNote?: string;
  offerAmount?: number;
  salesWithLeaseInPlace: boolean;
  priorYearAdjustment: boolean;
  priorYearAdjustmentAmount?: number;
  adjustmentNote?: string;
  remediationNote?: string;
  closeOutNote?: string;
  plannedFutureUse?: string;
  realtor?: string;
  realtorRate?: string;
  realtorCommission?: number;
  preliminaryFormSignedBy?: string;
  finalFormSignedBy?: string;
  removalFromSplRequestOn?: Date;
  removalFromSplApprovedOn?: Date;
  removalFromSplRationale?: string;
  documentationNote?: string;
  salesHistoryNote?: string;
  comments?: string;
  notes: IProjectNoteModel[];
  properties: IProjectPropertyModel[];
  tasks: IProjectTaskModel[];
  projectAgencyResponses: IProjectAgencyResponseModel[];
  statusHistory?: IProjectStatusHistoryModel[];
}
