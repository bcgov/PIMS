import * as Yup from 'yup';
import { CLASSIFICATIONS } from 'constants/classifications';

export const ApprovalConfirmationStepSchema = Yup.object().shape({
  confirmation: Yup.boolean()
    .oneOf([true], 'You must confirm approval before continuing.')
    .required('Required'),
});

export const DocumentationStepSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .max(100, 'Email must be less than 100 characters'),
  firstName: Yup.string().max(100, 'First Name must be less than 100 characters'),
  middleName: Yup.string().max(100, 'Middle Name must be less than 100 characters'),
  lastName: Yup.string().max(100, 'Last Name must be less than 100 characters'),
});

export const UpdateInfoStepYupSchema = Yup.object().shape({
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

export const GreTransferStepYupSchema = Yup.object().shape({
  properties: Yup.array().of(
    Yup.object().shape({
      classificationId: Yup.number().test(
        'is-valid',
        'Must select Core Operational or Core Strategic',
        (val: any) =>
          val === CLASSIFICATIONS.CoreOperational || val === CLASSIFICATIONS.CoreStrategic,
      ),
    }),
  ),
});

export const SelectProjectPropertiesStepYupSchema = Yup.object().shape({
  properties: Yup.array()
    .required('You must select at least one property')
    .min(1, 'You must select at least one property'),
});

export const ProjectDraftStepYupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
});

export const EnhancedReferralExemptionSchema = Yup.object().shape({
  exemptionRationale: Yup.string().when(
    'exemptionRequested',
    (exemptionRequested: boolean, schema: any) =>
      exemptionRequested
        ? schema.required('Rationale is required when applying for an exemption.')
        : schema,
  ),
});
