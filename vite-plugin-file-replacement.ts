import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { Plugin } from 'vite';

const EXTENSIONS = ['.tsx', '.ts', '.css'] as const;

const exists = (path: string): string | undefined => (existsSync(path) ? path : undefined);

const candidatePaths = (basePath: string, suffix: string): readonly string[] =>
  EXTENSIONS.flatMap((ext) =>
    basePath.endsWith(ext)
      ? [basePath.replace(ext, `${suffix}${ext}`), `${basePath}${suffix}${ext}`]
      : [`${basePath}${suffix}${ext}`]
  );

const findReplacement = (basePath: string, suffix: string): string | undefined =>
  [basePath, join(basePath, 'index')]
    .flatMap((p) => candidatePaths(p, suffix))
    .find(exists);

const resolveAlias = (source: string, importerDir: string, srcDir: string) =>
  source.startsWith('@/')
    ? { source: source.slice(2), baseDir: srcDir }
    : { source, baseDir: importerDir };

export const fileReplacement = (suffix: string, srcDir: string): Plugin => ({
  name: 'file-replacement',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer) return null;

    const { source: resolvedSource, baseDir } = resolveAlias(source, dirname(importer), srcDir);

    return findReplacement(resolve(baseDir, resolvedSource), suffix) ?? null;
  }
});
