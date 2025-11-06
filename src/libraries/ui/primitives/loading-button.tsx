import type { ComponentProps } from 'react';
import { Button, type ButtonClass } from './button';
import { Loading } from './loading';

export type LoadingButtonProps = ComponentProps<'button'> & ButtonClass & { isLoading: boolean };

export const LoadingButton = ({ isLoading, children, ...props }: LoadingButtonProps) => (
  <Button disabled={isLoading} {...props}>
    <Loading isLoading={isLoading}>{children}</Loading>
  </Button>
);
