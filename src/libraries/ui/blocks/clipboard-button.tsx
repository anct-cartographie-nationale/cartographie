'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '../primitives/button';
import { Tooltip } from '../primitives/tooltip';

type ClipboardButtonProps = ButtonProps & {
  target?: string;
  message?: {
    success: string;
    error: string;
  };
  duration?: number;
};

export const ClipboardButton = ({ target, message, duration = 750, ...props }: ClipboardButtonProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | undefined>();

  const handleCopy = async () => {
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
