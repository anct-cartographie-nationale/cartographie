import { cn } from '@/libraries/utils';
import { Tooltip } from '@/shared/ui/tooltip';
import type { Fraicheur, NiveauFraicheur } from '../../presenter/fraicheur.presenter';

const COULEURS: Record<NiveauFraicheur, { badge: string; pastille: string }> = {
  'a-jour': { badge: 'bg-[#e8edff] text-[#0063cb]', pastille: 'bg-[#0078f3]' },
  'a-surveiller': { badge: 'bg-[#fceeac] text-[#66673d]', pastille: 'bg-[#b7a73f]' },
  'a-verifier': { badge: 'bg-[#ffe9e6] text-[#b34000]', pastille: 'bg-[#d64d00]' },
  'a-actualiser': { badge: 'bg-[#ffe9e9] text-[#ce0500]', pastille: 'bg-[#e1000f]' }
};

export const FraicheurBadge = ({ niveau, libelle, explication }: Pick<Fraicheur, 'niveau' | 'libelle' | 'explication'>) => (
  <Tooltip
    content={explication}
    className={cn(
      'inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-sm font-bold cursor-help focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      COULEURS[niveau].badge
    )}
  >
    <span aria-hidden={true} className={cn('size-2 rounded-full', COULEURS[niveau].pastille)} />
    {libelle}
  </Tooltip>
);
