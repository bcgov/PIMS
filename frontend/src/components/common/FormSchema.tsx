import * as Yup from 'yup';

export const roleAgency = Yup.object().shape({
  agency: Yup.number()
    .min(1, 'Invalid Agency')
    .required('Required')
    .nullable(),
  role: Yup.string()
    .required('Required')
    .nullable(),
});
