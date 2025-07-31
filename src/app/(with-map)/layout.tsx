import type { ReactNode } from 'react';
import { Cartographie } from '@/features/cartographie/cartographie';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className='flex flex-1 overflow-hidden'>
    <div className='w-165 px-12 pt-8 pb-14 overflow-auto'>{children}</div>
    <Cartographie />
  </div>
);

export default Layout;
