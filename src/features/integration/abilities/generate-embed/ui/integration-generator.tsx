'use client';

import { useState } from 'react';
import { TrackerAction, TrackerCategory, trackEvent } from '@/configuration/telemetry/event-tracker';
import type { Territoire, Vue } from '@/features/integration/domain';
import { IntegrationOutput } from './integration-output';
import { TerritoirePicker } from './territoire-picker';

const VUES: { value: Vue; label: string; description: string }[] = [
  {
    value: 'filtree',
    label: 'Uniquement les lieux du territoire',
    description: 'En se déplaçant sur la carte, les lieux des autres territoires restent masqués.'
  },
  {
    value: 'centree',
    label: 'Carte centrée sur le territoire',
    description: 'Tous les lieux restent visibles, la carte démarre simplement sur votre territoire.'
  }
];

type IntegrationGeneratorProps = {
  siteUrl: string;
  version: string;
};

const Step = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
  <section className='flex flex-col gap-4'>
    <h2 className='text-xl font-bold flex items-center gap-3'>
      <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content text-base'>
        {number}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export const IntegrationGenerator = ({ siteUrl, version }: IntegrationGeneratorProps) => {
  const [territoire, setTerritoire] = useState<Territoire | null>(null);
  const [vue, setVue] = useState<Vue>('filtree');

  const changeTerritoire = (nextTerritoire: Territoire | null) => {
    setTerritoire(nextTerritoire);
    if (nextTerritoire) {
      trackEvent({ category: TrackerCategory.EMBED, action: TrackerAction.EMBED_GENERATE, name: nextTerritoire.type });
    }
  };

  return (
    <div className='flex flex-col gap-10'>
      <Step number={1} title='Choisissez votre territoire'>
        <TerritoirePicker onChange={changeTerritoire} />
      </Step>
      <Step number={2} title='Choisissez la vue'>
        <fieldset className='fieldset'>
          <legend className='sr-only'>Vue de la carte</legend>
          <div className='flex flex-col gap-3'>
            {VUES.map(({ value, label, description }) => (
              <label key={value} className='flex items-start gap-3 cursor-pointer'>
                <input
                  type='radio'
                  name='vue'
                  className='radio radio-primary mt-0.5'
                  value={value}
                  checked={vue === value}
                  onChange={() => setVue(value)}
                />
                <span className='flex flex-col'>
                  <span className='font-medium'>{label}</span>
                  <span className='text-sm'>{description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </Step>
      <Step number={3} title='Récupérez votre intégration'>
        {territoire ? (
          <>
            <p>
              Territoire sélectionné : <strong>{territoire.nom}</strong>
            </p>
            <IntegrationOutput key={territoire.code} siteUrl={siteUrl} version={version} territoire={territoire} vue={vue} />
          </>
        ) : (
          <p className='text-sm'>Sélectionnez un territoire pour obtenir votre lien ou votre code d'intégration.</p>
        )}
      </Step>
    </div>
  );
};
