'use client';

import type { FC, PropsWithChildren } from 'react';
import { provide } from '../container';
import { API_BASE_URL } from '../keys/api-base-url.key';
import { NAVBAR_CONFIG } from '../keys/navbar-config.key';

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  provide(API_BASE_URL, '/api');
  provide(NAVBAR_CONFIG, {
    logoUrl: '/images/app-logo.svg',
    appName: "Lieux d'inclusion numérique",
    helpUrl: 'mailto:cartographie.sonum@anct.gouv.fr',
    helpLabel: 'Aide'
  });
  return <>{children}</>;
};
