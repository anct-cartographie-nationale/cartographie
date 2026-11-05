'use client';

import type { FC, PropsWithChildren } from 'react';
import { sendContactMessageAction } from '@/app/_actions/contact/send-contact-message.action';
import { sendIntegrationRequestAction } from '@/app/_actions/integration/send-integration-request.action';
import { errorReporter } from '@/configuration/telemetry/error-reporter';
import { NAVBAR_CONFIG } from '@/features/brand/injection';
import { ContactAction } from '@/features/contact';
import { SEND_CONTACT_MESSAGE_ACTION } from '@/features/contact/abilities/send-message/injection/send-contact-message-action.key';
import { geoplateformeTerritoireSource, SEND_INTEGRATION_REQUEST_ACTION, TERRITOIRE_SOURCE } from '@/features/integration';
import { provide } from '@/libraries/injection';
import { THEME_COLORS } from '@/libraries/map';
import { getThemeColors } from '@/shared/ui';
import { API_BASE_URL } from '../keys/api-base-url.key';
import { CONTACT_ACTION } from '../keys/contact-action.key';
import { ERROR_REPORTER } from '../keys/error-reporter.key';
import { TERRITOIRE_FILTER } from '../keys/territoire-filter.key';

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  provide(API_BASE_URL, '/api');
  provide(ERROR_REPORTER, errorReporter);
  provide(NAVBAR_CONFIG, {
    logoUrl: '/images/app-logo.svg',
    appName: "Lieux d'inclusion numérique",
    helpLabel: 'Aide',
    integrationUrl: '/integrer'
  });
  provide(TERRITOIRE_FILTER, {});
  provide(THEME_COLORS, getThemeColors);
  provide(SEND_CONTACT_MESSAGE_ACTION, sendContactMessageAction);
  provide(CONTACT_ACTION, ContactAction);
  provide(TERRITOIRE_SOURCE, geoplateformeTerritoireSource);
  provide(SEND_INTEGRATION_REQUEST_ACTION, sendIntegrationRequestAction);

  return <>{children}</>;
};
