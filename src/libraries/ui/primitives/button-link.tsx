import type { AnchorHTMLAttributes, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { cn } from '@/libraries/utils';
import type { ButtonClass } from './button';

export type ButtonLinkProps = ButtonClass & {
  href: string;
  disabled?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  target?: HTMLAttributeAnchorTarget;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

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
  href,
  ...props
}: ButtonLinkProps) => (
  <a
    href={href}
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
  </a>
);
