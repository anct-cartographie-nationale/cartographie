import type { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';
import type { HTMLAttributeAnchorTarget, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import type { ButtonClass } from './button';

export type ButtonLinkProps = NextLinkProps &
  ButtonClass & {
    disabled?: boolean;
    icon?: ReactNode;
    iconOnly?: boolean;
    target?: HTMLAttributeAnchorTarget;
  } & HTMLAttributes<HTMLAnchorElement>;

export const ButtonLink = ({
  className,
  children,
  target,
  color,
  icon,
  iconOnly,
  kind,
  behavior,
  scale,
  modifier,
  disabled,
  ...props
}: ButtonLinkProps) => (
  <NextLink
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : undefined}
    className={cn('btn', disabled && 'btn-disabled', color, kind, behavior, scale, modifier, className)}
    target={target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    title={iconOnly && typeof children === 'string' ? children : undefined}
    {...props}
  >
    {icon && icon}
    {children && !iconOnly && children}
  </NextLink>
);
