import { z } from 'zod';

const toOptionalNumber = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  return Number(value);
};

export const outletFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  address: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  province: z.string().trim().min(1, 'Province is required'),
  latitude: z.preprocess(
    toOptionalNumber,
    z.number().min(-90, 'Latitude must be at least -90').max(90, 'Latitude must be at most 90'),
  ),
  longitude: z.preprocess(
    toOptionalNumber,
    z.number()
      .min(-180, 'Longitude must be at least -180')
      .max(180, 'Longitude must be at most 180'),
  ),
  maxServiceRadiusKm: z.preprocess(
    toOptionalNumber,
    z.number().positive('Service radius must be greater than 0'),
  ),
});

export type OutletFormSchemaInput = z.input<typeof outletFormSchema>;
export type OutletFormSchemaValues = z.infer<typeof outletFormSchema>;
