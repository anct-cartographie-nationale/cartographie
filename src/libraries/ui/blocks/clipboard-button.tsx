'use client';

import { Button, type ButtonProps, Tooltip } from '@arckit/daisyui/primitives';
import { type MouseEvent, useState } from 'react';

type ClipboardButtonProps = ButtonProps & {
  target?: string;
  message?: {
    success: string;
    error: string;
  };
  duration?: number;
};

export const ClipboardButton = ({ target, message, duration = 750, onClick, ...props }: ClipboardButtonProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | undefined>();

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    try {
      await navigator.clipboard.writeText(target ?? window.location.href);
      if (message?.success == null) return;
      setContent(message.success);
      setOpen(true);
    } catch {
      if (message?.error == null) return;
      setContent(message.error);
      setOpen(true);
    } finally {
      setTimeout(() => setOpen(false), duration);
    }
  };

  return (
    <Tooltip content={content} open={open}>
      <Button {...props} onClick={handleCopy} />
    </Tooltip>
  );
};
