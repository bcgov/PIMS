import * as Yup from 'yup';

export const EnhancedReferralExemptionApprovedForSplSchema = Yup.object().shape({
  clearanceNotificationSentOn: Yup.date().required('Required'),
  requestForSplReceivedOn: Yup.date().required('Required'),
});
