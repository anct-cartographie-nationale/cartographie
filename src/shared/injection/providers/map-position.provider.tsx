'use client';

import type { FC, PropsWithChildren } from 'react';
import { provide } from '@/libraries/injection';
import { invalidateMapLocationIfChanged } from '@/libraries/map';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { MAP_CONFIG } from '../keys/map-config.key';
import { mapPositionSchema } from '../keys/map-position.schema';

export const MapPositionProvider: FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const mapPosition = mapPositionSchema.parse(Object.fromEntries(searchParams));

  provide(MAP_CONFIG, mapPosition);
  invalidateMapLocationIfChanged(mapPosition);

  return children;
};
