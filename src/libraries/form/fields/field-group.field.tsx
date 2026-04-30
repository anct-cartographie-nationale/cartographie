import type { ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';

export const FieldGroup = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { state } = useFieldContext<string>();

  return <div className={cn(hasError(state) && 'border-l-2 border-error-content pl-2', className)}>{children}</div>;
};
