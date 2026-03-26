import type { MDXComponents } from 'mdx/types';

const components = {
  h1: ({ children }) => (
    <h1 className='text-base-title text-5xl font-bold my-16'>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className='text-base-title text-4xl font-bold mt-18 mb-6'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='text-base-title text-3xl font-medium mt-2 mb-4'>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className='text-base-title text-xl font-medium mt-2 mb-4'>
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className='text-base-title text-lg mt-2 mb-4'>
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className='text-base-title text-base mt-2 mb-4'>
      {children}
    </h6>
  ),
  p: ({ children }) => <p className='text-base-content my-4 leading-relaxed'>{children}</p>,
  a: ({ children, href }) => (
    <a href={href} className='text-primary hover:underline'>
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className='list-disc list-inside my-4 space-y-1 text-base-content'>{children}</ul>,
  ol: ({ children }) => <ol className='list-decimal list-inside my-4 space-y-1 text-base-content'>{children}</ol>,
  li: ({ children }) => <li className='m-0!'>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className='border-l-2 not-italic border-primary font-normal pl-4 text-muted'>{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className='overflow-x-auto my-6'>
      <table className='table-auto w-full border-collapse'>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className='bg-base-200'>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className='border-b border-base-300'>{children}</tr>,
  th: ({ children }) => <th className='text-left px-4 py-2 font-semibold text-base-title'>{children}</th>,
  td: ({ children }) => <td className='px-4 py-2 text-base-content'>{children}</td>,
  code: ({ children }) => <code className='bg-base-200 px-1.5 py-0.5 rounded text-sm font-mono'>{children}</code>,
  pre: ({ children }) => <pre className='bg-base-200 p-4 rounded-lg overflow-x-auto my-4'>{children}</pre>,
  hr: () => <hr className='my-8 border-base-300' />,
  strong: ({ children }) => <strong className='font-semibold text-base-title'>{children}</strong>,
  em: ({ children }) => <em className='italic'>{children}</em>
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => components;
