'use client';

import { type ComponentProps, createContext, type ReactNode, useContext, useEffect, useRef } from 'react';
import { cn } from '@/libraries/utils';

type ModalPosition = 'modal-top' | 'modal-bottom' | 'modal-middle';

const ModalContext = createContext<{ onClose?: (() => void) | undefined }>({});

export type ModalProps = Omit<ComponentProps<'dialog'>, 'open'> & {
  open: boolean;
  onClose?: () => void;
  position?: ModalPosition;
  responsive?: boolean;
};

export const Modal = ({ open, onClose, position, responsive, className, children, ...props }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onCloseRef.current?.();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  return (
    <ModalContext.Provider value={{ onClose }}>
      <dialog
        ref={dialogRef}
        className={cn('modal', position, responsive && 'modal-bottom sm:modal-middle', className)}
        {...props}
      >
        {open ? children : null}
      </dialog>
    </ModalContext.Provider>
  );
};

export type ModalBoxProps = ComponentProps<'div'> & {
  size?: 'max-w-sm' | 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl';
  fullWidth?: boolean;
};

export const ModalBox = ({ size, fullWidth, className, children, ...props }: ModalBoxProps) => (
  <div className={cn('modal-box', fullWidth && 'w-11/12', size, className)} {...props}>
    {children}
  </div>
);

export type ModalActionsProps = ComponentProps<'div'>;

export const ModalActions = ({ className, ...props }: ModalActionsProps) => (
  <div className={cn('modal-action', className)} {...props} />
);

export type ModalCloseButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  icon?: ReactNode;
};

export const ModalCloseButton = ({ icon, className, onClick, ...props }: ModalCloseButtonProps) => {
  const { onClose } = useContext(ModalContext);
  return (
    <button
      type='button'
      className={cn('btn btn-sm btn-circle btn-ghost absolute right-2 top-2', className)}
      onClick={onClick ?? onClose}
      {...props}
    >
      {icon ?? '\u2715'}
    </button>
  );
};

export type ModalBackdropProps = Omit<ComponentProps<'button'>, 'children'>;

export const ModalBackdrop = ({ className, onClick, ...props }: ModalBackdropProps) => {
  const { onClose } = useContext(ModalContext);
  return (
    <button
      type='button'
      className={cn('modal-backdrop', className)}
      onClick={onClick ?? onClose}
      aria-label='Fermer'
      {...props}
    />
  );
};
