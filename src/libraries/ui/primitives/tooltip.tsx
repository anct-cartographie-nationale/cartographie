'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { type MouseEvent, type ReactNode, useState } from 'react';

const OPEN_DELAY_MS = 200;

export const Tooltip = ({ content, children }: { content: ReactNode; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openOnTap = (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <RadixTooltip.Provider delayDuration={OPEN_DELAY_MS}>
      <RadixTooltip.Root open={isOpen} onOpenChange={setIsOpen}>
        <RadixTooltip.Trigger asChild={true} onClick={openOnTap}>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side='bottom'
            align='start'
            sideOffset={6}
            collisionPadding={8}
            className='z-50 max-w-72 rounded bg-black p-3 text-sm text-white'
          >
            {content}
            <RadixTooltip.Arrow />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
