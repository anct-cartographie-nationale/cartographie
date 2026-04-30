'use client';

import { type ReactNode, useState } from 'react';
import { Button, type ButtonClass } from '@/libraries/ui/primitives/button';
import { ContactFormModal } from './contact-form-modal';

type ContactActionProps = ButtonClass & {
  children: ReactNode;
  className?: string;
  pageUrl?: string;
};

const resolvePageUrl = (pageUrl: string): string => {
  if (pageUrl.startsWith('http')) return pageUrl;
  return `${window.location.origin}${pageUrl}`;
};

export const ContactAction = ({ children, className, pageUrl, ...buttonProps }: ContactActionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className={className} {...buttonProps}>
        {children}
      </Button>
      {isOpen && (
        <ContactFormModal
          open
          onClose={() => setIsOpen(false)}
          pageUrl={pageUrl != null ? resolvePageUrl(pageUrl) : undefined}
        />
      )}
    </>
  );
};
