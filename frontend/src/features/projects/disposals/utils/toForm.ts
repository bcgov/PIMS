import { ReviewWorkflowStatus } from 'features/projects/constants';
import { IProjectModel } from 'hooks/api/projects/disposals';

import { defaultFilter } from '../constants';
import { IProjectForm } from '../interfaces';
import { toPropertyForm } from '.';

/**
 * Initialize form values from a model.
 * @param model The original project model that you want to update with form values.
 * @returns A new instance of form values.
 */
export const toForm = (model: IProjectModel): IProjectForm => {
  return {
    filter: defaultFilter,
    id: model.id,
    projectNumber: model.projectNumber,
    name: model.name,
    agencyId: model.agencyId,
    agency: model.agency,
    agencyCode: model.agencyCode,
    subAgency: model.subAgency,
    subAgencyCode: model.subAgencyCode,
    transferToAgencyId: 0,
    description: model.description ?? '',
    reportedFiscalYear: model.reportedFiscalYear,
    actualFiscalYear: model.actualFiscalYear,
    manager: model.manager ?? '',
    sendNotifications: model.sendNotifications,
    workflowId: model.workflowId,
    workflowCode: model.workflowCode ?? '',
    originalWorkflowCode: model.workflowCode ?? '',
    statusId: model.statusId,
    statusCode: model.statusCode ?? '',
    originalStatusCode: model.statusCode ?? '',
    riskId: model.riskId,
    tierLevelId: model.tierLevelId,
    note: model.note ?? '',
    publicNote: model.publicNote ?? '',
    privateNote: model.privateNote ?? '',
    appraisedNote: model.appraisedNote ?? '',
    offersNote: model.offersNote ?? '',
    reportingNote: model.reportingNote ?? '',
    purchaser: model.purchaser ?? '',
    isContractConditional: model.isContractConditional,
    submittedOn: model.submittedOn ?? '',
    approvedOn: model.approvedOn ?? '',
    deniedOn: model.deniedOn ?? '',
    cancelledOn: model.cancelledOn ?? '',
    initialNotificationSentOn: model.initialNotificationSentOn ?? '',
    thirtyDayNotificationSentOn: model.thirtyDayNotificationSentOn ?? '',
    sixtyDayNotificationSentOn: model.sixtyDayNotificationSentOn ?? '',
    ninetyDayNotificationSentOn: model.ninetyDayNotificationSentOn ?? '',
    onHoldNotificationSentOn: model.onHoldNotificationSentOn ?? '',
    transferredWithinGreOn: model.transferredWithinGreOn ?? '',
    clearanceNotificationSentOn: model.clearanceNotificationSentOn ?? '',
    interestedReceivedOn: model.interestedReceivedOn ?? '',
    interestFromEnhancedReferralNote: model.interestFromEnhancedReferralNote ?? '',
    requestForSplReceivedOn: model.requestForSplReceivedOn ?? '',
    approvedForSplOn: model.approvedForSplOn ?? '',
    marketedOn: model.marketedOn ?? '',
    disposedOn: model.disposedOn ?? '',
    offerAcceptedOn: model.offerAcceptedOn ?? '',
    assessedOn: model.assessedOn ?? '',
    adjustedOn: model.adjustedOn ?? '',
    preliminaryFormSignedOn: model.preliminaryFormSignedOn ?? '',
    finalFormSignedOn: model.finalFormSignedOn ?? '',
    priorYearAdjustmentOn: model.priorYearAdjustmentOn ?? '',
    exemptionRequested: model.exemptionRequested,
    exemptionRationale: model.exemptionRationale ?? '',
    exemptionApprovedOn: model.exemptionApprovedOn ?? '',
    netBook: model.netBook ?? '',
    market: model.market ?? '',
    appraised: model.appraised ?? '',
    assessed: model.assessed ?? '',
    salesCost: model.salesCost ?? '',
    netProceeds: model.netProceeds ?? '',
    programCost: model.programCost ?? '',
    programCostNote: model.programCostNote ?? '',
    gainLoss: model.gainLoss ?? '',
    gainNote: model.gainNote ?? '',
    sppCapitalization: model.sppCapitalization ?? '',
    gainBeforeSpl: model.gainBeforeSpl ?? '',
    ocgFinancialStatement: model.ocgFinancialStatement ?? '',
    interestComponent: model.interestComponent ?? '',
    loanTermsNote: model.loanTermsNote ?? '',
    offerAmount: model.offerAmount ?? '',
    salesWithLeaseInPlace: model.salesWithLeaseInPlace,
    priorYearAdjustment: model.priorYearAdjustment,
    priorYearAdjustmentAmount: model.priorYearAdjustmentAmount ?? '',
    adjustmentNote: model.adjustmentNote ?? '',
    remediationNote: model.remediationNote ?? '',
    closeOutNote: model.closeOutNote ?? '',
    plannedFutureUse: model.plannedFutureUse ?? '',
    realtor: model.realtor ?? '',
    realtorRate: model.realtorRate ?? '',
    realtorCommission: model.realtorCommission ?? '',
    preliminaryFormSignedBy: model.preliminaryFormSignedBy ?? '',
    finalFormSignedBy: model.finalFormSignedBy ?? '',
    removalFromSplRequestOn: model.removalFromSplRequestOn ?? '',
    removalFromSplApprovedOn: model.removalFromSplApprovedOn ?? '',
    removalFromSplRationale: model.removalFromSplRationale ?? '',
    documentationNote: model.documentationNote ?? '',
    salesHistoryNote: model.salesHistoryNote ?? '',
    comments: model.comments ?? '',
    notes: model.notes.map((n) => {
      return {
        id: n.id,
        noteType: n.noteType,
        note: n.note,
      };
    }),
    tasks: model.tasks.map((task) => {
      // There are duplicate tasks in disposal that must match those in appraisal.
      if (task.statusCode === ReviewWorkflowStatus.DisposalProcess) {
        const appraisalTask = model.tasks.find(
          (t) => t.statusCode === ReviewWorkflowStatus.AppraisalReview && t.name === task.name,
        );
        if (!!appraisalTask) task.isCompleted = appraisalTask?.isCompleted;
      }
      return {
        taskId: task.taskId,
        isCompleted: task.isCompleted,
        completedOn: task.completedOn ?? '',
        name: task.name,
        description: task.description ?? '',
        isOptional: task.isOptional,
        isDisabled: task.isDisabled,
        sortOrder: task.sortOrder,
        statusId: task.statusId,
        statusCode: task.statusCode ?? '',
      };
    }),
    projectAgencyResponses: model.projectAgencyResponses.map((p) => {
      return {
        agencyId: p.agencyId,
        agencyCode: p.agencyCode ?? '',
        notificationId: p.notificationId ?? '',
        response: p.response,
        receivedOn: p.receivedOn ?? '',
        note: p.note ?? '',
        offerAmount: p.offerAmount,
      };
    }),
    properties: model.properties.map((p) => toPropertyForm(p)),
  };
};
