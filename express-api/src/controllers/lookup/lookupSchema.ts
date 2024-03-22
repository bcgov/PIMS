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
