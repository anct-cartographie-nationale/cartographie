import { createFormHook } from '@tanstack/react-form';
import { lazy } from 'react';
import { fieldContext, formContext } from './form-context';

const CheckboxGroup = lazy(() => import('./fields/checkbox-group.field').then((module) => ({ default: module.CheckboxGroup })));

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxGroup
  },
  formComponents: {}
});
