import * as Yup from 'yup';
import _ from 'lodash';
import { IStatus } from 'features/projects/common';

/**
 * Determine if the specified project status code requires a clearance notification sent on value.
 * @param statusCode The project status code.
 */
export const clearanceNotificationSentOnRequired = (statusCode: string) => {
  return _.includes(['ERP-ON', 'ERP-OH'], statusCode); // ERP-ON, ERP-OH
};

export const EnhancedReferralExemptionApprovedForSplSchema = Yup.object().shape({
  clearanceNotificationSentOn: Yup.date().when('status', (status: IStatus, schema: any) =>
    clearanceNotificationSentOnRequired(status.code) ? schema.required('Required') : schema,
  ),
  requestForSplReceivedOn: Yup.date().required('Required'),
});
