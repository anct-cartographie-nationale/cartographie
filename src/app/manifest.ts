import fs from 'fs';
import type { MetadataRoute } from 'next';
import path from 'path';
import { metadata } from './metadata';

export const dynamic = 'force-static';

const iconsDirectory = path.join(process.cwd(), 'public/icons');
const listFilesInDirectory = (dir: string): string[] => fs.readdirSync(dir).map((file) => path.join('/icons', file));

const sizeFromFineName = (src: string): { sizes?: string } => {
  const sizes: string | undefined = src.match(/\d+x\d+/)?.[0];
  return sizes ? { sizes } : {};
};

export const webManifest = (): MetadataRoute.Manifest => ({
  name: metadata.title,
  description: metadata.description,
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#000091',
  icons: listFilesInDirectory(iconsDirectory).map((src: string) => ({
    src,
    ...sizeFromFineName(src),
    type: 'image/png'
  }))
});

export default webManifest;
