'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';
import type { ButtonClass } from '@/libraries/ui/primitives/button';
import { cn } from '@/libraries/utils';

type DropdownProps = ButtonClass & {
  className?: string;
  isOpen?: boolean;
  contentClassName?: string;
  trigger: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  items: Record<string, ReactNode>;
};

export const Dropdown = ({
  className,
  color,
  kind,
  behavior,
  scale,
  modifier,
  isOpen,
  contentClassName = 'menu',
  trigger,
  onOpen,
  onClose,
  items
}: DropdownProps) => (
  <DropdownMenu.Root
    {...(isOpen != null ? { open: isOpen } : {})}
    onOpenChange={(open: boolean) => {
      open ? onOpen?.() : onClose?.();
    }}
  >
    <DropdownMenu.Trigger className={cn('btn m-1', color, kind, behavior, scale, modifier, className)}>
      {trigger}
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align='start'
        sideOffset={5}
        className={cn('menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm', contentClassName)}
        asChild
      >
        <ul>
          {Object.entries(items).map(([key, value]: [string, ReactNode]) => (
            <DropdownMenu.Item key={key} asChild>
              <li>{value}</li>
            </DropdownMenu.Item>
          ))}
        </ul>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
