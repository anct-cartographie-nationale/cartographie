'use client';

import type { FC, PropsWithChildren } from 'react';
import { NAVBAR_CONFIG } from '@/features/brand/injection';
import { provide } from '@/libraries/injection';
import { THEME_COLORS } from '@/libraries/map';
import { getThemeColors } from '@/shared/ui';
import { API_BASE_URL } from '../keys/api-base-url.key';
import { MAP_CONFIG } from '../keys/map-config.key';
import { TERRITOIRE_FILTER } from '../keys/territoire-filter.key';

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  provide(API_BASE_URL, '/api');
  provide(NAVBAR_CONFIG, {
    logoUrl: '/images/app-logo.svg',
    appName: "Lieux d'inclusion numérique",
    helpUrl: 'mailto:cartographie.sonum@anct.gouv.fr',
    helpLabel: 'Aide'
  });
  provide(MAP_CONFIG, {});
  provide(TERRITOIRE_FILTER, {});
  provide(THEME_COLORS, getThemeColors);
  return <>{children}</>;
};
