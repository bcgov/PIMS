import { IStatus } from 'features/projects/interfaces';
import { clearanceNotificationSentOnRequired } from 'utils';
import * as Yup from 'yup';

export const EnhancedReferralExemptionApprovedForSplSchema = Yup.object().shape({
  clearanceNotificationSentOn: Yup.date().when('status', (status: IStatus, schema: any) =>
    clearanceNotificationSentOnRequired(status.code) ? schema.required('Required') : schema,
  ),
  requestForSplReceivedOn: Yup.date().required('Required'),
});
