import fs from 'node:fs';
import type { Plugin } from 'vite';

const EXTENSIONS = ['.tsx', '.ts'];

export const fileReplacement = (suffix: string): Plugin => ({
  name: 'file-replacement',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer) return null;

    for (const ext of EXTENSIONS) {
      if (!source.endsWith(ext)) continue;

      const targerPath = source.replace(ext, `${suffix}${ext}`);
      const fullPath = new URL(targerPath, `file://${importer}`).pathname;

      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }
});
