import type { Config } from 'tailwindcss';

export default {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/content/**/*.{md,mdx}', './mdx-components.tsx', './tailwind.safelist']
} satisfies Config;
