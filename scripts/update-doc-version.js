#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const version = process.argv[2];

if (!version) {
  console.error('Usage: node update-doc-version.js <version>');
  process.exit(1);
}

const docPath = resolve(import.meta.dirname, '../docs/integration-web-component.md');
const content = readFileSync(docPath, 'utf-8');

const updated = content.replace(
  /@gouvfr-anct\/cartographie-nationale@[\d.]+/g,
  `@gouvfr-anct/cartographie-nationale@${version}`
);

writeFileSync(docPath, updated);
console.log(`Updated doc to version ${version}`);
