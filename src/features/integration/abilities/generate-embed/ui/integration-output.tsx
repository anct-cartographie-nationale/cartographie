'use client';

import { Button, ButtonLink, Checkbox, Input } from '@arckit/daisyui/primitives';
import { useId, useState } from 'react';
import { RiDownloadLine, RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { TrackerAction, TrackerCategory, trackEvent } from '@/configuration/telemetry/event-tracker';
import {
  buildIframeHtml,
  buildIntegrationUrl,
  buildWebComponentHtml,
  contrastColor,
  type IntegrationRequest,
  type Sortie,
  type Territoire,
  type Vue
} from '@/features/integration/domain';
import { ClipboardButton } from '@/libraries/ui/blocks/clipboard-button';
import { Link } from '@/libraries/ui/primitives/link';
import { cn } from '@/libraries/utils';
import { useQrCode } from './use-qr-code';

const WEB_COMPONENT_DOC_URL =
  'https://github.com/anct-cartographie-nationale/cartographie/blob/main/docs/integration-web-component.md';

type Output = 'url' | 'code' | 'qr-code';

const OUTPUTS: { value: Output; label: string; description: string }[] = [
  { value: 'url', label: 'Lien', description: 'Pour un site, une signature e-mail ou un document.' },
  { value: 'code', label: 'Code à intégrer', description: 'Pour afficher la carte dans une page de votre site.' },
  { value: 'qr-code', label: 'QR code', description: 'Pour une affiche, un flyer ou tout support imprimé.' }
];

type Code = Extract<Sortie, 'iframe' | 'web-component'>;

const CODES: { value: Code; label: string; description: string }[] = [
  {
    value: 'iframe',
    label: 'iframe',
    description:
      "Le plus simple : un seul bloc HTML à coller, sans script. La carte s'affiche dans un cadre isolé de votre site, sans personnalisation du titre, du logo ni des couleurs."
  },
  {
    value: 'web-component',
    label: 'Web component',
    description:
      "La carte s'intègre à votre page comme un élément natif et s'adapte à votre charte : titre, logo et couleur principale. Nécessite d'ajouter un script."
  }
];

export type IntegrationUsage = Pick<IntegrationRequest, 'sortie' | 'lien' | 'code' | 'personnalisation'>;

type IntegrationOutputProps = {
  siteUrl: string;
  version: string;
  territoire: Territoire;
  vue: Vue;
  onUse: (usage: IntegrationUsage) => void;
};

const copyMessage = { success: 'Copié !', error: 'Impossible de copier' };

const CodeBlock = ({ children, className }: { children: string; className?: string }) => (
  <pre className={cn('bg-base-200 rounded-box p-4 text-sm overflow-x-auto whitespace-pre-wrap break-all', className)}>
    <code>{children}</code>
  </pre>
);

const qrCodeFileName = (territoire: Territoire): string =>
  `qr-code-${territoire.path.split('/').filter(Boolean).join('-')}.png`;

const QrCodeOutput = ({
  url,
  fileName,
  territoire,
  onDownload
}: {
  url: string;
  fileName: string;
  territoire: Territoire;
  onDownload: () => void;
}) => {
  const { canvasRef, dataUrl } = useQrCode(url);

  return (
    <div className='flex flex-col items-start gap-3'>
      <canvas
        ref={canvasRef}
        role='img'
        aria-label={`QR code vers la cartographie des lieux d'inclusion numérique - ${territoire.nom}`}
        className='h-64 w-64 rounded-box border border-base-300 bg-white'
      />
      <ButtonLink href={dataUrl ?? '#'} download={fileName} color='btn-primary' disabled={dataUrl == null} onClick={onDownload}>
        <RiDownloadLine size={16} />
        Télécharger le QR code
      </ButtonLink>
    </div>
  );
};

export const IntegrationOutput = ({ siteUrl, version, territoire, vue, onUse }: IntegrationOutputProps) => {
  const [output, setOutput] = useState<Output>('url');
  const [code, setCode] = useState<Code>('iframe');
  const [appName, setAppName] = useState(`Lieux d'inclusion numérique - ${territoire.nom}`);
  const [logoUrl, setLogoUrl] = useState('');
  const [hasCustomColor, setHasCustomColor] = useState(false);
  const [colorPrimary, setColorPrimary] = useState('#000000');
  const ids = { appName: useId(), logoUrl: useId(), colorPrimary: useId(), customColor: useId() };

  const url = buildIntegrationUrl({ siteUrl, territoire, vue });
  const iframeHtml = buildIframeHtml({ siteUrl, territoire, vue });
  const personnalisation = {
    titre: appName || `Lieux d'inclusion numérique - ${territoire.nom}`,
    logoUrl,
    ...(hasCustomColor ? { couleurPrincipale: colorPrimary } : {})
  };
  const webComponentHtml = buildWebComponentHtml({
    siteUrl,
    version,
    territoire,
    vue,
    appName: personnalisation.titre,
    logoUrl,
    colorPrimary: hasCustomColor ? colorPrimary : undefined,
    colorPrimaryContent: hasCustomColor ? contrastColor(colorPrimary) : undefined
  });

  const use = (sortie: Sortie) => () => {
    trackEvent({
      category: TrackerCategory.EMBED,
      action: sortie === 'qr-code' ? TrackerAction.EMBED_QR_DOWNLOAD : TrackerAction.EMBED_COPY,
      name: sortie
    });
    onUse({
      sortie,
      lien: url,
      ...(sortie === 'iframe' ? { code: iframeHtml } : {}),
      ...(sortie === 'web-component' ? { code: webComponentHtml, personnalisation } : {})
    });
  };

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
            <ClipboardButton color='btn-primary' target={url} message={copyMessage} onClick={use('lien')}>
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
      {output === 'qr-code' && (
        <QrCodeOutput url={url} fileName={qrCodeFileName(territoire)} territoire={territoire} onDownload={use('qr-code')} />
      )}
      {output === 'code' && (
        <div className='flex flex-col gap-4'>
          <fieldset className='fieldset'>
            <legend className='sr-only'>Type de code</legend>
            <div className='flex flex-col gap-3'>
              {CODES.map(({ value, label, description }) => (
                <label key={value} className='flex items-start gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='code'
                    className='radio radio-primary mt-0.5'
                    value={value}
                    checked={code === value}
                    onChange={() => setCode(value)}
                  />
                  <span className='flex flex-col'>
                    <span className='font-medium'>{label}</span>
                    <span className='text-sm'>{description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {code === 'iframe' && (
            <>
              <CodeBlock>{iframeHtml}</CodeBlock>
              <div className='flex flex-wrap items-center gap-4'>
                <ClipboardButton color='btn-primary' target={iframeHtml} message={copyMessage} onClick={use('iframe')}>
                  <RiFileCopyLine size={16} />
                  Copier le code
                </ClipboardButton>
              </div>
            </>
          )}
          {code === 'web-component' && (
            <>
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
              <CodeBlock className='max-h-96 overflow-y-auto'>{webComponentHtml}</CodeBlock>
              <div className='flex flex-wrap items-center gap-4'>
                <ClipboardButton
                  color='btn-primary'
                  target={webComponentHtml}
                  message={copyMessage}
                  onClick={use('web-component')}
                >
                  <RiFileCopyLine size={16} />
                  Copier le code
                </ClipboardButton>
                <Link href={WEB_COMPONENT_DOC_URL} target='_blank' color='link-primary' className='text-sm'>
                  Guide d'intégration du web component
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
