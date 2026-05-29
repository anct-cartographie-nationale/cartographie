'use client';

import type { ButtonClass } from '@arckit/daisyui/primitives';
import { ButtonLink } from '@arckit/daisyui/primitives';
import type { ReactNode } from 'react';

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
