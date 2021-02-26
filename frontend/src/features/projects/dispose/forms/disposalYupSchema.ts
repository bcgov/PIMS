import * as Yup from 'yup';
import { Classifications } from 'constants/classifications';

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
  netBook: Yup.number().required('Required'),
  market: Yup.number().required('Required'),
  assessed: Yup.number().required('Required'),
  properties: Yup.array().of(
    Yup.object().shape({
      classificationId: Yup.number().test(
        'is-valid',
        'Must select Surplus Active or Surplus Encumbered',
        (val: any) =>
          val === Classifications.SurplusActive || val === Classifications.SurplusEncumbered,
      ),
    }),
  ),
});

export const DenyProjectYupSchema = Yup.object().shape({
  publicNote: Yup.string().required('Shared note must contain a reason before denying project.'),
});

export const ApproveExemptionRequestSchema = Yup.object().shape({
  exemptionApprovedOn: Yup.date().required('Required'),
});

export const GreTransferStepYupSchema = Yup.object().shape({
  properties: Yup.array().of(
    Yup.object().shape({
      classificationId: Yup.number().test(
        'is-valid',
        'Must select Core Operational or Core Strategic',
        (val: any) =>
          val === Classifications.CoreOperational || val === Classifications.CoreStrategic,
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
  name: Yup.string()
    .max(100, 'Name allows a maximum of 100 characters.')
    .required('Required'),
  description: Yup.string().max(1000, 'Description allows a maximum of 1000 characters.'),
  note: Yup.string().max(2000, 'Note allows a maximum of 2000 characters.'),
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
