import { key } from 'piqure';

export type NavbarConfig = {
  logoUrl?: string | undefined;
  appName?: string | undefined;
  helpUrl?: string | undefined;
  helpLabel?: string | undefined;
};

export const NAVBAR_CONFIG = key<NavbarConfig>('navbar-config');
