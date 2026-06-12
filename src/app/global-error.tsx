'use client';

import NextError from 'next/error';
import { useEffect } from 'react';
import { errorReporter } from '@/configuration/telemetry/error-reporter';

const GlobalError = ({ error }: { error: globalThis.Error & { digest?: string } }) => {
  useEffect(() => {
    errorReporter.captureException({ error });
  }, [error]);

  return (
    <html lang='fr'>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
};

export default GlobalError;
