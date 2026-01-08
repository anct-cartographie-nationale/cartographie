import type { FC, ReactNode } from 'react';
import { ThemeProvider } from '@/libraries/ui/theme/providers/theme.provider';

type WebComponentLayoutProps = {
  children: ReactNode;
};

export const WebComponentLayout: FC<WebComponentLayoutProps> = ({ children }) => (
  <ThemeProvider attribute='data-theme' defaultTheme='light' enableSystem disableTransitionOnChange>
    <div className='h-full flex flex-col'>{children}</div>
  </ThemeProvider>
);
