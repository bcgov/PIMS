import * as Yup from 'yup';
import { CLASSIFICATIONS } from 'constants/classifications';

export const SurplusPropertyListYupSchema = Yup.object().shape({
  marketedOn: Yup.date().required('Required'),
  offersReceived: Yup.string().max(2000, 'Offers received must be less then 2000 characters'),
  isContractConditional: Yup.boolean().required('Required'),
  offerAcceptedOn: Yup.date().required('Required'),
  purchaser: Yup.string()
    .required('Required')
    .max(150, 'Purchaser must be less then 150 characters'),
  offerAmount: Yup.number()
    .min(1, 'Offer amount must be greater then or equal to $1')
    .required('Required'),
  disposedOn: Yup.date().required('Required'),
});

export const SurplusPropertyInformationYupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().max(1000, 'Description must be less then 1000 characters'),
  manager: Yup.string().max(1000, 'Manager must be less then 1000 characters'),
  reportedFiscalYear: Yup.string().matches(/^\d\d\d\d$/, 'Invalid year'),
  actualFiscalYear: Yup.string().matches(/^\d\d\d\d$/, 'Invalid year'),
  approvedOn: Yup.date().required('Required'),
  submittedOn: Yup.date().required('Required'),
  tierLevelId: Yup.number().required('Required'),
  properties: Yup.array().of(
    Yup.object().shape({
      classificationId: Yup.number().test(
        'is-valid',
        'Must select Surplus Active or Surplus Encumbered',
        (val: any) =>
          val === CLASSIFICATIONS.SurplusActive || val === CLASSIFICATIONS.SurplusEncumbered,
      ),
      netBook: Yup.number()
        .required()
        .min(0.01, 'Minimum value is $1')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
      estimated: Yup.number()
        .required()
        .min(0.01, 'Minimum value is $1')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
    }),
  ),
});
