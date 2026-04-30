import type { ReactNode } from 'react';
import { useFieldContext } from '../form-context';
import { hasError } from './has-error';

const toMessage = (error: unknown): string =>
  typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error);

const ErrorIcon = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: the icon is decorative and does not convey any information that is not already conveyed by the text
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M17.5,2.5h-11L1,12l5.5,9.5h11L23,12L17.5,2.5z M16.2,14.8l-1.4,1.4L12,13.4l-2.8,2.8l-1.4-1.4l2.8-2.8L7.8,9.2l1.4-1.4l2.8,2.8l2.8-2.8l1.4,1.4L13.4,12L16.2,14.8z' />
  </svg>
);

export const ErrorMessage = ({ className = 'text-error-content mt-1 text-xs' }: { className?: string }): ReactNode => {
  const { state } = useFieldContext<string>();
  const messages = [...new Set(state.meta.errors.filter(Boolean).map(toMessage))];

  if (!hasError(state) || messages.length === 0) return null;

  return messages.length === 1 ? (
    <p className={`${className} flex items-center gap-1 mt-3`}>
      <ErrorIcon />
      {messages[0]}
    </p>
  ) : (
    <ul className={className}>
      {messages.map((message) => (
        <li key={message} className='flex items-center gap-1 mt-3'>
          <ErrorIcon />
          {message}
        </li>
      ))}
    </ul>
  );
};
