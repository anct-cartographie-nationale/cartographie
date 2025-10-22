'use client';

import * as RadixPopover from '@radix-ui/react-popover';
import type { ReactNode } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import type { ButtonClass } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';

type PopoverProps = ButtonClass & {
  className?: string;
  isOpen?: boolean;
  contentClassName?: string;
  trigger: ReactNode;
  children: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
};

export const Trigger = ({ children }: { children: ReactNode }) => (
  <>
    {children} <RiArrowDownSLine />
  </>
);

export const Popover = ({
  className,
  color,
  kind,
  behavior,
  scale,
  modifier,
  isOpen,
  contentClassName = 'menu',
  trigger,
  children,
  onOpen,
  onClose
}: PopoverProps) => (
  <RadixPopover.Root
    {...(isOpen != null ? { open: isOpen } : {})}
    onOpenChange={(open: boolean) => {
      open ? onOpen?.() : onClose?.();
    }}
  >
    <RadixPopover.Trigger className={cn('btn m-1', color, kind, behavior, scale, modifier, className)}>
      {trigger}
    </RadixPopover.Trigger>
    <RadixPopover.Portal>
      <RadixPopover.Content className={cn('dropdown-content bg-base-100 rounded-box z-1 shadow-xl', contentClassName)}>
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  </RadixPopover.Root>
);
