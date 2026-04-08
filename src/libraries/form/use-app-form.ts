import { createFormHook } from '@tanstack/react-form';
import { CheckboxGroup } from './fields/checkbox-group.field';
import { fieldContext, formContext } from './form-context';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxGroup
  },
  formComponents: {}
});
