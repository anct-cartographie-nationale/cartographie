import type { ReactNode } from 'react';
import { useFieldContext } from '../form-context';

export const Label = ({
  children,
  suffix,
  className = 'mb-1 block'
}: {
  children: ReactNode;
  suffix?: string;
  className?: string;
}) => {
  const { name } = useFieldContext<string>();

  return (
    <label htmlFor={suffix ? `${name}-${suffix}` : name} className={className}>
      {children}
    </label>
  );
};
