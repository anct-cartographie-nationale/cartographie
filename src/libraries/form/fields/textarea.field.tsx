import { Textarea, type TextareaProps } from '@/libraries/ui/primitives/textarea';
import { cn } from '@/libraries/utils';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';

type TextareaFieldProps = Omit<TextareaProps, 'name' | 'value' | 'onChange' | 'onBlur'> & {
  isPending: boolean;
};

export const TextareaField = ({ isPending, className, ...props }: TextareaFieldProps) => {
  const { name, state, handleBlur, handleChange } = useFieldContext<string>();

  return (
    <Textarea
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
