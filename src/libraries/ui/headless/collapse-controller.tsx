import { type HTMLAttributes, type ReactNode, useId, useState } from 'react';
import { cn } from '@/libraries/utils';

type RenderCollapseProps = {
  toggle: {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-label': string;
  };
  collapsible: (props?: { className?: string }) => HTMLAttributes<HTMLElement>;
};

type CollapseControllerProps = {
  children: (props: RenderCollapseProps) => ReactNode;
};

export const CollapseController = ({ children }: CollapseControllerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const collapsibleId = useId();

  return children({
    toggle: {
      onClick: () => setIsOpen(() => !isOpen),
      'aria-expanded': isOpen,
      'aria-controls': collapsibleId,
      'aria-label': isOpen ? 'Fermer le menu' : 'Ouvrir le menu'
    },
    collapsible: (props?: { className?: string }): HTMLAttributes<HTMLElement> => ({
      id: collapsibleId,
      className: cn(isOpen ? 'collapse-open' : 'collapse-close', props?.className)
    })
  });
};
