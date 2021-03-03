import * as Yup from 'yup';
import { IStatus } from 'features/projects/common';
import { clearanceNotificationSentOnRequired } from 'utils';

export const EnhancedReferralExemptionApprovedForSplSchema = Yup.object().shape({
  clearanceNotificationSentOn: Yup.date().when('status', (status: IStatus, schema: any) =>
    clearanceNotificationSentOnRequired(status.code) ? schema.required('Required') : schema,
  ),
  requestForSplReceivedOn: Yup.date().required('Required'),
});
