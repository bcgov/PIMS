import * as Yup from 'yup';

export const SurplusPropertyListYupSchema = Yup.object().shape({
  marketedOn: Yup.date().required('Required'),
  offersReceived: Yup.string().max(2000, 'Offers received must be less then 2000 characters'),
  isContractConditional: Yup.boolean().required('Required'),
  offerAcceptedOn: Yup.date().required('Required'),
  purchaser: Yup.string()
    .required('Required')
    .max(150, 'Purchaser must be less then 150 characters'),
  offerAmount: Yup.number()
    .min(1, 'Offer amount must be a positive number')
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
  netBook: Yup.number().required('Required'),
  estimated: Yup.number().required('Required'),
  assessed: Yup.number().required('Required'),
  properties: Yup.array().of(
    Yup.object().shape({
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
    .min(0, 'Interest component must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  ocgFinancialStatement: Yup.number()
    .min(0, 'OCG Financial must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  salesCost: Yup.number()
    .min(0, 'Sales Cost amount must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  salesProceeds: Yup.number()
    .min(0, 'Sales Proceeds must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),

  gainBeforeSpp: Yup.number()
    .min(0, 'Gain Before Spp Cost must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  gainAfterSpp: Yup.number()
    .min(0, 'Gain After Spp Cost must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  programCost: Yup.number()
    .min(0, 'SPP Program Cost must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  priorYearAdjustmentAmount: Yup.number()
    .min(0, 'Prior Year Adjustment Amount must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  assessed: Yup.number()
    .min(0, 'Assessed must be a positive number')
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
        .min(0, 'Must be a positive number')
        .max(1000000000, 'Maximum value is $1,000,000,000'),
      appraisedDate: Yup.date(),
      appraisedFirm: Yup.string().max(150, 'Manager must be less then 150 characters'),
      assessed: Yup.number()
        .required()
        .min(0, 'Must be a positive number')
        .max(1000000000, 'Maximum value is $1,000,000,000'),
      assessedDate: Yup.date(),
    }),
  ),
});
