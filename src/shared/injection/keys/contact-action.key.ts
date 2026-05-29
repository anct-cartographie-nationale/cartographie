import type { ButtonClass } from '@arckit/daisyui/primitives';
import { keyFor } from 'piqure';
import type { FC, ReactNode } from 'react';

export type ContactActionProps = ButtonClass & {
  children: ReactNode;
  className?: string;
  pageUrl?: string;
};

export const CONTACT_ACTION = keyFor<FC<ContactActionProps>>('contact-action');
