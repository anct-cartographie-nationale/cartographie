'use client';

import { type ReactNode, useEffect, useState } from 'react';

type ClientOnlyProps = {
  children: ReactNode;
};

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) return null;

  return <>{children}</>;
};
