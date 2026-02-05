import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const EXTENSIONS = ['.tsx', '.ts', ".css"];

export const fileReplacement = (suffix: string): Plugin => ({
  name: 'file-replacement',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer) return null;

    const importerDir = path.dirname(importer);

    for (const ext of EXTENSIONS) {
      if (source.endsWith(ext)) {
        const targetPath = source.replace(ext, `${suffix}${ext}`);
        const fullPath = path.resolve(importerDir, targetPath);

        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      }

      const targetPath = `${source}${suffix}${ext}`;
      const fullPath = path.resolve(importerDir, targetPath);

      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }
});
