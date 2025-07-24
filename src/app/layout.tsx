import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { metadata as appMetadata } from './metadata';

export const metadata: Metadata = appMetadata;

const RootLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang='fr'>
    <body>{children}</body>
  </html>
);

export default RootLayout;
