import { Select, type SelectProps } from '@/libraries/ui/primitives/select';
import { cn } from '@/libraries/utils';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = Omit<SelectProps, 'name' | 'value' | 'onChange' | 'onBlur'> & {
  isPending: boolean;
  options: SelectOption[];
  placeholder?: string;
};

export const SelectField = ({ isPending, options, placeholder, className, ...props }: SelectFieldProps) => {
  const { name, state, handleBlur, handleChange } = useFieldContext<string>();

  return (
    <Select
      id={name}
      name={name}
      value={state.value}
      disabled={isPending ?? props.disabled}
      onBlur={handleBlur}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(hasError(state) && 'border-error-content', className)}
      {...props}
    >
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
};
