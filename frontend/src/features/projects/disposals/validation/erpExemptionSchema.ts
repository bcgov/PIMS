import * as yup from 'yup';

export const erpExemptionSchema = yup.object({
  exemptionRequested: yup.boolean(),
  exemptionRationale: yup.string().when('exemptionRequested', {
    is: true,
    then: () => yup.string().required('Exemption rationale required'),
  }),
});
