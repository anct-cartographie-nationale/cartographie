import { Input, type InputProps } from '@/libraries/ui/primitives/input';
import { cn } from '@/libraries/utils';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';

type InputFieldProps = Omit<InputProps, 'name' | 'value' | 'onChange' | 'onBlur'> & {
  isPending: boolean;
};

export const InputField = ({ isPending, className, ...props }: InputFieldProps) => {
  const { name, state, handleBlur, handleChange } = useFieldContext<string>();

  return (
    <Input
      id={name}
      name={name}
      value={state.value}
      disabled={isPending ?? props.disabled}
      onBlur={handleBlur}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(hasError(state) && 'border-error-content', className)}
      {...props}
    />
  );
};
