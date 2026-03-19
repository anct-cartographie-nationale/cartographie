import { z } from 'zod';

const optionalNumber = z
  .string()
  .transform((val) => parseFloat(val))
  .pipe(z.number().finite())
  .optional()
  .catch(undefined);

export const mapPositionSchema = z.object({
  latitude: optionalNumber,
  longitude: optionalNumber,
  zoom: optionalNumber
});

export type MapPosition = z.infer<typeof mapPositionSchema>;
