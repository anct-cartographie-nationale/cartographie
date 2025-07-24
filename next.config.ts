import type { NextConfig } from 'next';
import { env } from '@/env';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: env.NEXT_PUBLIC_BASE_PATH
};

export default nextConfig;
