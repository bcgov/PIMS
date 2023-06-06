import { Classifications } from 'constants/classifications';
import { z } from 'zod';

export const ApprovalConfirmationStepSchema = z.object({
  confirmation: z.boolean().refine((value) => value === true, {
    message: 'You must confirm approval before continuing.',
  }),
});

export const DocumentationStepSchema = z.object({
  email: z.string().email().max(100, 'Email must be less than 100 characters'),
  firstName: z.string().max(100, 'First Name must be less than 100 characters'),
  middleName: z.string().max(100, 'Middle Name must be less than 100 characters'),
  lastName: z.string().max(100, 'Last Name must be less than 100 characters'),
});

export const UpdateInfoStepZodSchema = z.object({
  netBook: z
    .string()
    .nonempty()
    .or(z.number())
    .refine((value) => typeof value === 'number', {
      message: 'Required',
    }),
  market: z
    .string()
    .nonempty()
    .or(z.number())
    .refine((value) => typeof value === 'number', {
      message: 'Required',
    }),
  assessed: z
    .string()
    .nonempty()
    .or(z.number())
    .refine((value) => typeof value === 'number', {
      message: 'Required',
    }),
  properties: z.array(
    z.object({
      classificationId: z
        .number()
        .refine(
          (val) =>
            val === Classifications.SurplusActive || val === Classifications.SurplusEncumbered,
          {
            message: 'Must select Surplus Active or Surplus Encumbered',
          },
        ),
    }),
  ),
});

export const DenyProjectZodSchema = z.object({
  publicNote: z.string().nonempty('Shared note must contain a reason before denying project.'),
});

export const ApproveExemptionRequestSchema = z.object({
  exemptionApprovedOn: z.date().or(z.string()),
});

export const GreTransferStepZodSchema = z.object({
  properties: z.array(
    z.object({
      classificationId: z
        .number()
        .refine(
          (val) => val === Classifications.CoreOperational || val === Classifications.CoreStrategic,
          {
            message: 'Must select Core Operational or Core Strategic',
          },
        ),
    }),
  ),
});

export const SelectProjectPropertiesStepZodSchema = z.object({
  properties: z.array(z.unknown()).min(1, 'You must select at least one property'),
});

export const ProjectDraftStepZodSchema = z.object({
  name: z.string().max(100, 'Name allows a maximum of 100 characters.').nonempty('Required'),
  description: z.string().max(1000, 'Description allows a maximum of 1000 characters.'),
  note: z.string().max(2000, 'Note allows a maximum of 2000 characters.'),
});

export const EnhancedReferralExemptionSchema = z
  .object({
    exemptionRationale: z.string().optional(),
    exemptionRequested: z.boolean(),
  })
  .refine((data) => !(data.exemptionRequested && !data.exemptionRationale), {
    message: 'Rationale is required when applying for an exemption.',
    path: ['exemptionRationale'],
  });
