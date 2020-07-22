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
  manager: Yup.string().max(150, 'Manager must be less then 150 characters'),
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
        .min(1, 'Minimum value is $1')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
      estimated: Yup.number()
        .required()
        .min(1, 'Minimum value is $1')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
    }),
  ),
});

export const CloseOutFormValidationSchema = Yup.object().shape({
  manager: Yup.string().max(150, 'Manager must be less then 150 characters'),
  plannedFutureUse: Yup.string().max(150, 'Planned Future Use must be less then 150 characters'),
  remediation: Yup.string().max(150, 'Remediation must be less then 150 characters'),
  preliminaryFormSignedBy: Yup.string().max(
    150,
    'Preliminary Form Signed By must be less then 150 characters',
  ),
  finalFormSignedBy: Yup.string().max(150, 'Final Form Signed By must be less then 150 characters'),
  interestComponent: Yup.number()
    .min(1, 'Interest component must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  ocgFinancialStatement: Yup.number()
    .min(1, 'OCG Financial must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  salesCost: Yup.number()
    .min(1, 'Sales Cost amount must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  salesProceeds: Yup.number()
    .min(1, 'Sales Proceeds must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),

  gainBeforeSpp: Yup.number()
    .min(1, 'Gain Before Spp Cost must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  gainAfterSpp: Yup.number()
    .min(1, 'Gain After Spp Cost must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  programCost: Yup.number()
    .min(1, 'SPP Program Cost must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  priorYearAdjustmentAmount: Yup.number()
    .min(1, 'Prior Year Adjustment Amount must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  assessed: Yup.number()
    .min(1, 'Assessed must be greater then or equal to $1')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  assessedOn: Yup.date(),
  adjustedOn: Yup.date(),
  offerAcceptedOn: Yup.date(),
  preliminaryFormSignedOn: Yup.date(),
  finalFormSignedOn: Yup.date(),
  properties: Yup.array().of(
    Yup.object().shape({
      appraised: Yup.number()
        .required()
        .min(1, 'Minimum value is $1')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
      appraisedDate: Yup.date(),
      appraisedFirm: Yup.string().max(150, 'Manager must be less then 150 characters'),
    }),
  ),
});
