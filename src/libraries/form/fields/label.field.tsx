import type { ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';

export const Label = ({
  children,
  suffix,
  required,
  className = 'mb-2 block'
}: {
  children: ReactNode;
  suffix?: string;
  required?: boolean;
  className?: string;
}) => {
  const { name, state } = useFieldContext<string>();

  return (
    <label htmlFor={suffix ? `${name}-${suffix}` : name} className={cn(className, hasError(state) && 'text-error-content')}>
      {children}
      {required && <span className='text-error-content ml-0.5'>*</span>}
    </label>
  );
};
