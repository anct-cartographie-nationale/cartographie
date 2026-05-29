import '@/styles/globals.css';
import { Toaster } from '@arckit/daisyui/blocks-client';
import { ThemeProvider } from '@arckit/daisyui/theme';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { MatomoTracker } from '@/libraries/analytics';
import { ConfigProvider } from '@/shared/injection/providers/config.provider';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang='fr' suppressHydrationWarning>
    <body>
      <NuqsAdapter>
        <ConfigProvider>
          <MatomoTracker />
          <ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem disableTransitionOnChange>
            <Toaster directionY='toast-top' directionX='toast-center' />
            {children}
          </ThemeProvider>
        </ConfigProvider>
      </NuqsAdapter>
    </body>
  </html>
);

export default RootLayout;
