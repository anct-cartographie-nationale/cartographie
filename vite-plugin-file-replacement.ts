import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const EXTENSIONS = ['.tsx', '.ts'];

export const fileReplacement = (suffix: string): Plugin => ({
  name: 'file-replacement',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer) return null;

    const importerDir = path.dirname(importer);

    for (const ext of EXTENSIONS) {
      // Handle imports with explicit extension
      if (source.endsWith(ext)) {
        const targetPath = source.replace(ext, `${suffix}${ext}`);
        const fullPath = path.resolve(importerDir, targetPath);

        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      }

      // Handle imports without extension
      const targetPath = `${source}${suffix}${ext}`;
      const fullPath = path.resolve(importerDir, targetPath);

      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }
});
