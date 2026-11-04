'use client';

import { type ReactNode, useId, useState } from 'react';
import { defer, filter, fromEvent } from 'rxjs';
import { useTap } from '@/libraries/reactivity/Subscribe';

const escapeKey$ = defer(() => fromEvent<KeyboardEvent>(document, 'keydown')).pipe(filter(({ key }) => key === 'Escape'));

export const Tooltip = ({ content, className, children }: { content: ReactNode; className?: string; children: ReactNode }) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  useTap(escapeKey$, () => setIsOpen(false));

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <span className='relative inline-flex'>
      <button
        type='button'
        aria-describedby={id}
        className={className}
        onClick={open}
        onFocus={open}
        onBlur={close}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </button>
      <span
        id={id}
        role='tooltip'
        hidden={!isOpen}
        className='absolute top-full left-0 z-10 w-72 max-w-[80vw] pt-2 text-sm font-normal text-base-content'
        onMouseEnter={open}
        onMouseLeave={close}
      >
        <span className='block rounded border border-base-200 bg-base-100 p-3 shadow-lg'>{content}</span>
      </span>
    </span>
  );
};
