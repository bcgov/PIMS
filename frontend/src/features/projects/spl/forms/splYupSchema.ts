import * as Yup from 'yup';

export const NotInSplYupSchema = Yup.object().shape({
  clearanceNotificationSentOn: Yup.date().required('Required'),
});

export const RemoveFromSplYupSchema = Yup.object().shape({
  removalFromSplRequestOn: Yup.date().required('Required'),
  removalFromSplApprovedOn: Yup.date().required('Required'),
  removalFromSplRationale: Yup.string()
    .required('Required')
    .max(2000, 'Rationale must be less then 2000 characters'),
});

export const SurplusPropertyListOnMarketYupSchema = Yup.object().shape({
  marketedOn: Yup.date().required('Required'),
});

export const SurplusPropertyListContractInPlaceYupSchema = Yup.object().shape({
  offersReceived: Yup.string().max(2000, 'Offers received must be less then 2000 characters'),
  offerAcceptedOn: Yup.date().required('Required'),
  purchaser: Yup.string()
    .required('Required')
    .max(150, 'Purchaser must be less then 150 characters'),
  offerAmount: Yup.number()
    .min(1, 'Offer amount must be a positive number')
    .required('Required'),
});

export const SurplusPropertyListDisposeYupSchema = Yup.object().shape({
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
  market: Yup.number().required('Required'),
  assessed: Yup.number().required('Required'),
  properties: Yup.array().of(
    Yup.object().shape({
      netBook: Yup.number()
        .required()
        .min(0, 'Minimum value is $0')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
      market: Yup.number()
        .required()
        .min(0, 'Minimum value is $0')
        .max(1000000000, 'Maximum value is $1,000,000,000')
        .required('Required'),
    }),
  ),
});

export const CloseOutFormValidationSchema = Yup.object().shape({
  manager: Yup.string().max(150, 'Manager must be less then 150 characters'),
  plannedFutureUse: Yup.string().max(150, 'Planned Future Use must be less then 150 characters'),
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
  market: Yup.number()
    .min(0, 'Sales Proceeds must be a positive number')
    .max(100000000000, 'Maximum value is $100,000,000,000'),

  gainBeforeSpl: Yup.number()
    .min(-10000000000, 'Minimum value is `$10,000,000,000')
    .max(100000000000, 'Maximum value is $100,000,000,000'),
  netProceeds: Yup.number()
    .min(-10000000000, 'Minimum value is `$10,000,000,000')
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
});
