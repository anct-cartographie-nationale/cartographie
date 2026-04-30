import { keyFor } from 'piqure';
import type { FC, ReactNode } from 'react';
import type { ButtonClass } from '@/libraries/ui/primitives/button';

export type ContactActionProps = ButtonClass & {
  children: ReactNode;
  className?: string;
  pageUrl?: string;
};

export const CONTACT_ACTION = keyFor<FC<ContactActionProps>>('contact-action');
