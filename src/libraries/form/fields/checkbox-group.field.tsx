import type { ReactNode } from 'react';
import { Checkbox as CheckboxBase, type CheckboxProps as CheckboxBaseProps } from '@/libraries/ui/primitives/checkbox';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';
import { Label } from './label.field';

type CheckboxOption = {
  label: ReactNode;
  value: string;
  id: string;
};

type CheckboxGroupProps = Omit<CheckboxBaseProps, 'name' | 'type' | 'children'> & {
  isPending: boolean;
  options: CheckboxOption[];
};

const add = (state: { value: string[] }) => (value: string) => [...state.value, value];

const remove = (state: { value: string[] }) => (value: string) => state.value.filter((v) => v !== value);

export const CheckboxGroup = ({
  isPending,
  options,
  className = 'flex items-center gap-x-1.5',
  ...props
}: CheckboxGroupProps) => {
  const { name, state, handleBlur, handleChange } = useFieldContext<string[]>();

  return options.map(({ label, value, id }) => (
    <Label key={value} className={className} suffix={`${id}`}>
      <CheckboxBase
        id={`${name}-${id}`}
        name={name}
        value={value}
        disabled={isPending ?? props.disabled}
        onBlur={handleBlur}
        checked={state.value.includes(value)}
        onChange={(): void => handleChange(state.value.includes(value) ? remove(state)(value) : add(state)(value))}
        color={hasError(state) ? 'checkbox-error' : 'checkbox-primary'}
        className={state.meta.errors.length === 0 ? 'not-checked:border-base-500' : undefined}
        {...props}
      />
      {label}
    </Label>
  ));
};
