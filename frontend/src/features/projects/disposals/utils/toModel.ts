import {
  IProjectAgencyResponseModel,
  IProjectModel,
  IProjectNoteModel,
  IProjectTaskModel,
} from 'hooks/api/projects/disposals';

import { IProjectForm } from '../interfaces';
import { toPropertyModel } from '.';

/**
 * Update a project model with form
 * @param model The original project model that you want to update with form values.
 * @param values Form values.
 * @returns A new instance of a project model with form values.
 */
export const toModel = (model: IProjectModel | undefined, values: IProjectForm): IProjectModel => {
  return {
    ...model,
    ...values,
    submittedOn: values.submittedOn ? values.submittedOn : undefined,
    approvedOn: values.approvedOn ? values.approvedOn : undefined,
    deniedOn: values.deniedOn ? values.deniedOn : undefined,
    cancelledOn: values.cancelledOn ? values.cancelledOn : undefined,
    initialNotificationSentOn: values.initialNotificationSentOn
      ? values.initialNotificationSentOn
      : undefined,
    thirtyDayNotificationSentOn: values.thirtyDayNotificationSentOn
      ? values.thirtyDayNotificationSentOn
      : undefined,
    sixtyDayNotificationSentOn: values.sixtyDayNotificationSentOn
      ? values.sixtyDayNotificationSentOn
      : undefined,
    ninetyDayNotificationSentOn: values.ninetyDayNotificationSentOn
      ? values.ninetyDayNotificationSentOn
      : undefined,
    onHoldNotificationSentOn: values.onHoldNotificationSentOn
      ? values.onHoldNotificationSentOn
      : undefined,
    transferredWithinGreOn: values.transferredWithinGreOn
      ? values.transferredWithinGreOn
      : undefined,
    clearanceNotificationSentOn: values.clearanceNotificationSentOn
      ? values.clearanceNotificationSentOn
      : undefined,
    interestedReceivedOn: values.interestedReceivedOn ? values.interestedReceivedOn : undefined,
    requestForSplReceivedOn: values.requestForSplReceivedOn
      ? values.requestForSplReceivedOn
      : undefined,
    approvedForSplOn: values.approvedForSplOn ? values.approvedForSplOn : undefined,
    marketedOn: values.marketedOn ? values.marketedOn : undefined,
    disposedOn: values.disposedOn ? values.disposedOn : undefined,
    offerAcceptedOn: values.offerAcceptedOn ? values.offerAcceptedOn : undefined,
    assessedOn: values.assessedOn ? values.assessedOn : undefined,
    adjustedOn: values.adjustedOn ? values.adjustedOn : undefined,
    preliminaryFormSignedOn: values.preliminaryFormSignedOn
      ? values.preliminaryFormSignedOn
      : undefined,
    finalFormSignedOn: values.finalFormSignedOn ? values.finalFormSignedOn : undefined,
    priorYearAdjustmentOn: values.priorYearAdjustmentOn ? values.priorYearAdjustmentOn : undefined,
    exemptionApprovedOn: values.exemptionApprovedOn ? values.exemptionApprovedOn : undefined,
    removalFromSplRequestOn: values.removalFromSplRequestOn
      ? values.removalFromSplRequestOn
      : undefined,
    removalFromSplApprovedOn: values.removalFromSplApprovedOn
      ? values.removalFromSplApprovedOn
      : undefined,

    netBook: values.netBook !== '' ? values.netBook : undefined,
    market: values.market !== '' ? values.market : undefined,
    appraised: values.appraised !== '' ? values.appraised : undefined,
    assessed: values.assessed !== '' ? values.assessed : undefined,
    salesCost: values.salesCost !== '' ? values.salesCost : undefined,
    netProceeds: values.netProceeds !== '' ? values.netProceeds : undefined,
    programCost: values.programCost !== '' ? values.programCost : undefined,
    gainLoss: values.gainLoss !== '' ? values.gainLoss : undefined,
    sppCapitalization: values.sppCapitalization !== '' ? values.sppCapitalization : undefined,
    gainBeforeSpl: values.gainBeforeSpl !== '' ? values.gainBeforeSpl : undefined,
    ocgFinancialStatement:
      values.ocgFinancialStatement !== '' ? values.ocgFinancialStatement : undefined,
    interestComponent: values.interestComponent !== '' ? values.interestComponent : undefined,
    offerAmount: values.offerAmount !== '' ? values.offerAmount : undefined,
    priorYearAdjustmentAmount:
      values.priorYearAdjustmentAmount !== '' ? values.priorYearAdjustmentAmount : undefined,
    realtorCommission: values.realtorCommission !== '' ? values.realtorCommission : undefined,

    notes: values.notes.map((n) => {
      const note = model?.notes.find((i) => i.id === n.id);
      return {
        ...note,
        projectId: values.id,
        noteType: n.noteType,
        note: n.note,
      } as IProjectNoteModel;
    }),
    tasks: values.tasks.map((t) => {
      const task = model?.tasks.find((i) => i.taskId === t.taskId);

      return {
        ...task,
        projectId: values.id,
        isCompleted: t.isCompleted,
        completedOn: t.completedOn ? t.completedOn : undefined,
      } as IProjectTaskModel;
    }),
    projectAgencyResponses: values.projectAgencyResponses.map((p) => {
      return {
        ...p,
        projectId: values.id,
        notificationId: p.notificationId !== '' ? p.notificationId : undefined,
        response: p.response,
        receivedOn: p.receivedOn ? p.receivedOn : undefined,
        note: p.note,
        offerAmount: p.offerAmount,
      } as IProjectAgencyResponseModel;
    }),
    properties: values.properties.map((p) => {
      const existingProperty = model?.properties.find((i) => i.id === p.id);
      return toPropertyModel(p, existingProperty);
    }),
  };
};
