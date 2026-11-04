import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';

export default function Loading() {
  return (
    <main id={contentId}>
      <h1 className='font-bold uppercase text-xs text-base-title'>Recherche des lieux les plus proches…</h1>
    </main>
  );
}
