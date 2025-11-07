import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  open: boolean;
};

export const Tooltip = ({ children, content, open }: TooltipProps) => (
  <RadixTooltip.Provider>
    <RadixTooltip.Root open={open}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content className='text-sm bg-black px-2 rounded'>
          {content}
          <RadixTooltip.Arrow />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);
