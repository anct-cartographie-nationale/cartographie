'use client';

import type { ComponentProps } from 'react';
import { type ToastType, useToaster } from 'react-hot-toast';
import type { Toast } from 'react-hot-toast/headless';
import { cn } from '@/libraries/utils';
import { Alert, type AlertClass, type AlertProps } from '../primitives/alert';
import type { PlacementX, PlacementY } from '../primitives/placement';

type ToastTypeColor = Exclude<ToastType, 'custom' | 'blank'>;

type ToasterProps<Prefix extends `${string}toast` = 'toast'> = ComponentProps<'div'> &
  Pick<AlertClass, 'kind'> & {
    directionX?: `${Prefix}-${PlacementX}`;
    directionY?: `${Prefix}-${PlacementY}`;
  };

const toastColors: Record<ToastTypeColor, NonNullable<AlertProps['color']>> = {
  success: 'alert-success',
  error: 'alert-error',
  loading: 'alert-info'
};

const isAllowedTypeColor = (toast: Toast): toast is Toast & { type: ToastTypeColor } =>
  !['blank', 'custom'].includes(toast.type);

export const Toaster = ({ directionX, directionY, kind, ...props }: ToasterProps) => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: This <div> only handles mouse events for UX purposes and is not intended to be an interactive or focusable element
    <div className={cn('toast z-10', directionX, directionY)} onMouseEnter={startPause} onMouseLeave={endPause} {...props}>
      {toasts
        .filter(({ visible }: Toast) => visible)
        .map((toast: Toast) => (
          <Alert
            key={toast.id}
            {...(kind ? { kind } : {})}
            {...(isAllowedTypeColor(toast) ? { color: toastColors[toast.type] } : {})}
            {...toast.ariaProps}
          >
            {toast.icon}
            {typeof toast.message === 'function' ? toast.message(toast) : toast.message}
          </Alert>
        ))}
    </div>
  );
};
