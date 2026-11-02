'use client';

import { Button, ButtonLink, Checkbox, Input } from '@arckit/daisyui/primitives';
import { useId, useState } from 'react';
import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { TrackerAction, TrackerCategory, trackEvent } from '@/configuration/telemetry/event-tracker';
import {
  buildIntegrationUrl,
  buildWebComponentHtml,
  contrastColor,
  type Territoire,
  type Vue
} from '@/features/integration/domain';
import { ClipboardButton } from '@/libraries/ui/blocks/clipboard-button';
import { Link } from '@/libraries/ui/primitives/link';
import { cn } from '@/libraries/utils';

const WEB_COMPONENT_DOC_URL =
  'https://github.com/anct-cartographie-nationale/cartographie/blob/main/docs/integration-web-component.md';

type Output = 'url' | 'web-component';

const OUTPUTS: { value: Output; label: string; description: string }[] = [
  { value: 'url', label: 'Lien', description: 'Pour un site, une signature e-mail ou un document.' },
  { value: 'web-component', label: 'Code à intégrer', description: 'Pour afficher la carte dans une page de votre site.' }
];

type IntegrationOutputProps = {
  siteUrl: string;
  version: string;
  territoire: Territoire;
  vue: Vue;
};

const copyMessage = { success: 'Copié !', error: 'Impossible de copier' };

const CodeBlock = ({ children, className }: { children: string; className?: string }) => (
  <pre className={cn('bg-base-200 rounded-box p-4 text-sm overflow-x-auto whitespace-pre-wrap break-all', className)}>
    <code>{children}</code>
  </pre>
);

export const IntegrationOutput = ({ siteUrl, version, territoire, vue }: IntegrationOutputProps) => {
  const [output, setOutput] = useState<Output>('url');
  const [appName, setAppName] = useState(`Lieux d'inclusion numérique - ${territoire.nom}`);
  const [logoUrl, setLogoUrl] = useState('');
  const [hasCustomColor, setHasCustomColor] = useState(false);
  const [colorPrimary, setColorPrimary] = useState('#000000');
  const ids = { appName: useId(), logoUrl: useId(), colorPrimary: useId(), customColor: useId() };

  const url = buildIntegrationUrl({ siteUrl, territoire, vue });
  const html = buildWebComponentHtml({
    siteUrl,
    version,
    territoire,
    vue,
    appName: appName || `Lieux d'inclusion numérique - ${territoire.nom}`,
    logoUrl,
    colorPrimary: hasCustomColor ? colorPrimary : undefined,
    colorPrimaryContent: hasCustomColor ? contrastColor(colorPrimary) : undefined
  });

  const trackCopy = (name: Output) => () =>
    trackEvent({ category: TrackerCategory.EMBED, action: TrackerAction.EMBED_COPY, name });

  return (
    <div className='flex flex-col gap-4'>
      <div role='tablist' className='tabs tabs-box w-fit'>
        {OUTPUTS.map(({ value, label }) => (
          <Button
            key={value}
            type='button'
            role='tab'
            aria-selected={output === value}
            className={cn('tab', output === value && 'tab-active')}
            onClick={() => setOutput(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      <p className='text-sm'>{OUTPUTS.find(({ value }) => value === output)?.description}</p>
      {output === 'url' && (
        <div className='flex flex-col gap-3'>
          <CodeBlock>{url}</CodeBlock>
          <div className='flex flex-wrap gap-2'>
            <ClipboardButton color='btn-primary' target={url} message={copyMessage} onClick={trackCopy('url')}>
              <RiFileCopyLine size={16} />
              Copier le lien
            </ClipboardButton>
            <ButtonLink href={url} target='_blank' rel='noopener noreferrer' kind='btn-outline' color='btn-primary'>
              <RiExternalLinkLine size={16} />
              Ouvrir dans un nouvel onglet
            </ButtonLink>
          </div>
        </div>
      )}
      {output === 'web-component' && (
        <div className='flex flex-col gap-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor={ids.appName} className='label mb-1'>
                Titre affiché dans la barre de navigation
              </label>
              <Input id={ids.appName} className='w-full' value={appName} onChange={(e) => setAppName(e.target.value)} />
            </div>
            <div>
              <label htmlFor={ids.logoUrl} className='label mb-1'>
                Adresse de votre logo
              </label>
              <Input
                id={ids.logoUrl}
                className='w-full'
                type='url'
                placeholder='https://mon-site.fr/logo.png'
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>
            <div className='sm:col-span-2 flex flex-wrap items-center gap-4'>
              <label htmlFor={ids.customColor} className='flex items-center gap-2 cursor-pointer'>
                <Checkbox
                  id={ids.customColor}
                  color='checkbox-primary'
                  checked={hasCustomColor}
                  onChange={(e) => setHasCustomColor(e.target.checked)}
                />
                Utiliser ma couleur principale
              </label>
              {hasCustomColor && (
                <div className='flex items-center gap-2'>
                  <label htmlFor={ids.colorPrimary} className='sr-only'>
                    Couleur principale
                  </label>
                  <input
                    id={ids.colorPrimary}
                    type='color'
                    className='h-10 w-14 cursor-pointer rounded-field border border-base-300 bg-transparent'
                    value={colorPrimary}
                    onChange={(e) => setColorPrimary(e.target.value)}
                  />
                  <span className='font-mono text-sm'>{colorPrimary}</span>
                </div>
              )}
            </div>
          </div>
          <CodeBlock className='max-h-96 overflow-y-auto'>{html}</CodeBlock>
          <div className='flex flex-wrap items-center gap-4'>
            <ClipboardButton color='btn-primary' target={html} message={copyMessage} onClick={trackCopy('web-component')}>
              <RiFileCopyLine size={16} />
              Copier le code
            </ClipboardButton>
            <Link href={WEB_COMPONENT_DOC_URL} target='_blank' color='link-primary' className='text-sm'>
              Guide d'intégration du web component
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
