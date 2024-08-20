import { z } from 'zod';

// I was going to use the existing Project schema as a base here, but they differ significantly enough that I think it can be standalone.

const NoteSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const ProjectSchema = z.object({
  projectNumber: z.string(),
  reportedFiscalYear: z.number(),
  actualFiscalYear: z.number(),
  activity: z.string(),
  status: z.string(),
  agency: z.string(),
  description: z.string(),
  landLegalDescription: z.string(),
  risk: z.string(),
  manager: z.string(),
  location: z.string(),
  completedOn: z.string(),
  disposedOn: z.string(),
  notes: z.array(NoteSchema),
  exemptionRequested: z.boolean(),
  initialNotificationSentOn: z.string(),
  interestedReceivedOn: z.string(),
  clearanceNotificationSentOn: z.string(),
  requestForSplReceivedOn: z.string(),
  approvedForSplOn: z.string(),
  marketedOn: z.string(),
  purchaser: z.string(),
  isContractConditional: z.boolean(),
  market: z.number(),
  netBook: z.number(),
  assessed: z.number(),
  appraised: z.number(),
  appraisedBy: z.string(),
  appraisedOn: z.string(),
  programCost: z.number(),
  gainLoss: z.number(),
  interestComponent: z.number(),
  salesCost: z.number(),
  netProceeds: z.number(),
  priorNetProceeds: z.number(),
  variance: z.number(),
  ocgFinancialStatement: z.number(),
  saleWithLeaseInPlace: z.boolean(),
  snapshotOn: z.string(),
});

export const ImportProjectRequestSchema = z.array(ProjectSchema);

export type ImportProjectRequest = z.infer<typeof ImportProjectRequestSchema>;

const PropertySchema = z.object({
  updated: z.boolean(),
  added: z.boolean(),
  parcelId: z.string(),
  pid: z.string(),
  pin: z.string(),
  status: z.string(),
  fiscalYear: z.number(),
  agency: z.string(),
  agencyCode: z.string(),
  subAgency: z.string(),
  propertyType: z.string(),
  localId: z.string(),
  name: z.string(),
  description: z.string(),
  classification: z.string(),
  civicAddress: z.string(),
  city: z.string(),
  postal: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  landArea: z.number(),
  landLegalDescription: z.string(),
  buildingFloorCount: z.number(),
  buildingConstructionType: z.string(),
  buildingPredominateUse: z.string(),
  buildingTenancy: z.string(),
  buildingRentableArea: z.number(),
  assessed: z.number(),
  netBook: z.number(),
  regionalDistrict: z.string(),
  error: z.string(),
});

export const ImportPropertyRequestSchema = z.array(PropertySchema);

export type ImportPropertyRequest = z.infer<typeof ImportPropertyRequestSchema>;

export const ChesFilterSchema = z.object({
  txId: z.string().uuid().optional(),
  msgId: z.string().uuid().optional(),
  status: z.string().optional(),
  tag: z.string().optional(),
});

export type ChesFilter = z.infer<typeof ChesFilterSchema>;
