'use client';

import { type ReactNode, useState } from 'react';
import { Button, type ButtonClass } from '@/libraries/ui/primitives/button';
import { ContactFormModal } from './contact-form-modal';

type ContactActionProps = ButtonClass & {
  children: ReactNode;
  className?: string;
  pageUrl?: string;
};

const resolvePageUrl = (pageUrl?: string): string => {
  if (pageUrl?.startsWith('http')) return pageUrl;
  return `${window.location.origin}${pageUrl ?? window.location.pathname}`;
};

export const ContactAction = ({ children, className, pageUrl, ...buttonProps }: ContactActionProps) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>();

  const handleOpen = () => setResolvedUrl(resolvePageUrl(pageUrl));
  const handleClose = () => setResolvedUrl(undefined);

  return (
    <>
      <Button onClick={handleOpen} className={className} {...buttonProps}>
        {children}
      </Button>
      <ContactFormModal open={resolvedUrl != null} onClose={handleClose} pageUrl={resolvedUrl} />
    </>
  );
};
