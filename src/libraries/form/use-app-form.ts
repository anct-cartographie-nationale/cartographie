import { createFormHook } from '@tanstack/react-form';
import { CheckboxGroup } from './fields/checkbox-group.field';
import { ErrorMessage } from './fields/error-message.field';
import { FieldGroup } from './fields/field-group.field';
import { InputField } from './fields/input.field';
import { SelectField } from './fields/select.field';
import { TextareaField } from './fields/textarea.field';
import { fieldContext, formContext } from './form-context';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxGroup,
    ErrorMessage,
    FieldGroup,
    InputField,
    SelectField,
    TextareaField
  },
  formComponents: {}
});
