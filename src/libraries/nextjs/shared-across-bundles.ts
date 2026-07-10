/**
 * Next.js compiles a module once per server bundle layer (the RSC/pages layer and
 * the route-handler layer resolve it under different conditions), so module-level
 * state (`let x = …`) is evaluated — and therefore duplicated — in each. Anything
 * meant to be a single source of truth across those layers must live somewhere the
 * bundles share: globalThis (one per realm/process).
 *
 * `sharedAcrossBundles` returns the same instance for a given name regardless of
 * which bundle asks. The factory runs at most once per process.
 *
 * Process-scoped: this bridges the in-process bundle split, NOT multiple replicas —
 * each replica keeps its own copy.
 */
export const sharedAcrossBundles = <T>(name: string, create: () => T): T => {
  const globalScope = globalThis as typeof globalThis & { __sharedAcrossBundles?: Map<string, unknown> };
  if (!globalScope.__sharedAcrossBundles) {
    globalScope.__sharedAcrossBundles = new Map();
  }
  const registry = globalScope.__sharedAcrossBundles;
  if (!registry.has(name)) {
    registry.set(name, create());
  }
  return registry.get(name) as T;
};
