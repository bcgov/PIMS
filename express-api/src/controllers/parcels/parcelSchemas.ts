import {z} from 'zod';

export const parcelQuerySchema = z.object({
  agency: z.string().optional(),
  administrativeArea: z.string().optional(),
  classification: z.string().optional(),
  province: z.string().optional(),
  regionalDistrict: z.string().optional(),
  pid: z.number().optional(),
  pin: z.number().optional(),
  parentPid: z.number().optional(),
  propertyType: z.string().optional(),
})

export type ParcelQueryFilter = z.infer<typeof parcelQuerySchema>;
