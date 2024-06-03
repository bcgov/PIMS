import { z } from 'zod';

export const ClassificationPublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  SortOrder: z.number(),
  IsVisible: z.boolean(),
});

export const PredominateUsePublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  SortOrder: z.number(),
});

export const BuildingConstructionPublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  SortOrder: z.number(),
});

export const RegionalDistrictPublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  Abbreviation: z.string(),
});

export const TierLevelPublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  SortOrder: z.number(),
});

export const ProjectStatusPublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  SortOrder: z.number(),
  IsDisabled: z.boolean(),
});

export const TaskPublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  Description: z.string(),
  IsOptional: z.boolean(),
  StatusId: z.number(),
});

export const NoteTypePublicResponseSchema = z.object({
  Name: z.string(),
  Id: z.number(),
  Description: z.string(),
  IsOptional: z.boolean(),
  StatusId: z.number().nullable(),
});
