import '@/styles/globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { MatomoTracker } from '@/libraries/analytics';
import { Toaster } from '@/libraries/ui/blocks/toaster';
import { ThemeProvider } from '@/libraries/ui/theme/providers';
import { ConfigProvider } from '@/shared/injection';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang='fr' suppressHydrationWarning>
    <head>{process.env['NEXT_ASSET_PREFIX'] && <link rel='preconnect' href={process.env['NEXT_ASSET_PREFIX']} />}</head>
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
