'use client';

import { Input } from '@arckit/daisyui/primitives';
import { startTransition, useId, useState } from 'react';
import { useServerAction } from '@/configuration/nextjs/client';
import { TrackerAction, TrackerCategory, trackEvent } from '@/configuration/telemetry/event-tracker';
import { emailSchema, type Territoire, type Vue } from '@/features/integration/domain';
import { inject } from '@/libraries/injection';
import { SEND_INTEGRATION_REQUEST_ACTION } from '../injection/send-integration-request-action.key';
import { IntegrationOutput, type IntegrationUsage } from './integration-output';
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

const OUTPUT_HINT = "pour obtenir votre lien, votre code d'intégration ou votre QR code.";

const missingHint = ({ hasEmail, hasTerritoire }: { hasEmail: boolean; hasTerritoire: boolean }): string => {
  if (!hasEmail && !hasTerritoire) return `Renseignez votre adresse e-mail et sélectionnez un territoire ${OUTPUT_HINT}`;
  if (!hasEmail) return `Renseignez votre adresse e-mail ${OUTPUT_HINT}`;
  return `Sélectionnez un territoire ${OUTPUT_HINT}`;
};

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
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [territoire, setTerritoire] = useState<Territoire | null>(null);
  const [vue, setVue] = useState<Vue>('filtree');
  const emailId = useId();
  const emailErrorId = useId();
  const [sendIntegrationRequest] = useServerAction(inject(SEND_INTEGRATION_REQUEST_ACTION));

  const emailResult = emailSchema.safeParse(email);
  const hasEmail = emailResult.success;
  const emailError = emailTouched && !hasEmail ? (emailResult.error?.issues[0]?.message ?? 'Adresse e-mail invalide') : null;

  const changeTerritoire = (nextTerritoire: Territoire | null) => {
    setTerritoire(nextTerritoire);
    if (nextTerritoire) {
      trackEvent({ category: TrackerCategory.EMBED, action: TrackerAction.EMBED_GENERATE, name: nextTerritoire.type });
    }
  };

  const use = (usage: IntegrationUsage) => {
    if (!territoire || !hasEmail) return;
    trackEvent({ category: TrackerCategory.EMBED, action: TrackerAction.EMBED_REQUEST_SEND, name: usage.sortie });
    startTransition(() => {
      void sendIntegrationRequest({
        email,
        territoire: { type: territoire.type, code: territoire.code, nom: territoire.nom },
        vue,
        ...usage
      });
    });
  };

  return (
    <div className='flex flex-col gap-10'>
      <Step number={1} title='Vos coordonnées'>
        <div className='max-w-md'>
          <label htmlFor={emailId} className='label mb-1'>
            Adresse e-mail <span className='text-error-content'>*</span>
          </label>
          <Input
            id={emailId}
            className='w-full'
            type='email'
            autoComplete='email'
            required
            placeholder='prenom.nom@collectivite.fr'
            value={email}
            aria-invalid={emailError != null}
            aria-describedby={emailError ? emailErrorId : undefined}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
          />
          {emailError ? (
            <p id={emailErrorId} className='text-sm text-error-content mt-1'>
              {emailError}
            </p>
          ) : (
            <p className='text-sm mt-1'>
              Elle nous permet de vous accompagner dans votre intégration et de vous prévenir en cas d'évolution.
            </p>
          )}
        </div>
      </Step>
      <Step number={2} title='Choisissez votre territoire'>
        <TerritoirePicker onChange={changeTerritoire} />
      </Step>
      <Step number={3} title='Choisissez la vue'>
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
      <Step number={4} title='Récupérez votre intégration'>
        {territoire && hasEmail ? (
          <>
            <p>
              Territoire sélectionné : <strong>{territoire.nom}</strong>
            </p>
            <IntegrationOutput
              key={territoire.code}
              siteUrl={siteUrl}
              version={version}
              territoire={territoire}
              vue={vue}
              onUse={use}
            />
          </>
        ) : (
          <p className='text-sm'>{missingHint({ hasEmail, hasTerritoire: territoire != null })}</p>
        )}
      </Step>
    </div>
  );
};
