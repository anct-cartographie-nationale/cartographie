'use client';

import type { FC, PropsWithChildren } from 'react';
import { provide } from '../container';
import { API_BASE_URL } from '../keys/api-base-url.key';
import { MAP_CONFIG } from '../keys/map-config.key';
import { NAVBAR_CONFIG } from '../keys/navbar-config.key';
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
  return <>{children}</>;
};
