import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  return <div className='overflow-auto pb-12'>{children}</div>;
};

export default Layout;
