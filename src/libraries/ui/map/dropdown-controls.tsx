import type { ReactNode } from 'react';
import { Dropdown } from '@/libraries/ui/primitives/dropdown';
import { ReactControl } from './react-control';

export const DropdownControls = ({
  items,
  trigger,
  position = 'top-right'
}: {
  items: Record<string, ReactNode>;
  trigger: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) => (
  <ReactControl position={position}>
    <div className='bg-primary rounded'>
      <Dropdown
        className='border-base-100 bg-base-100 shadow-lg m-0 font-(family-name:--font-sans)'
        kind='btn-outline'
        color='btn-primary'
        items={items}
        trigger={trigger}
      />
    </div>
  </ReactControl>
);
