'use client';

import type { ReactNode } from 'react';
import type { ButtonClass } from '@/libraries/ui/primitives/button';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';

type ContactActionProps = ButtonClass & {
  children: ReactNode;
  className?: string;
  pageUrl?: string;
};

const buildMailtoHref = (pageUrl?: string): string => {
  const subject = 'Demande de contact';
  const body = pageUrl ? `URL de la page concernée : ${pageUrl}` : '';
  return `mailto:cartographie.sonum@anct.gouv.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const ContactAction = ({ children, className, pageUrl, ...buttonProps }: ContactActionProps) => (
  <ButtonLink href={buildMailtoHref(pageUrl)} className={className} {...buttonProps}>
    {children}
  </ButtonLink>
);
