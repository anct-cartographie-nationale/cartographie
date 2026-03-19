'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { RiMenuLine, RiQuestionFill } from 'react-icons/ri';
import { inject } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { useSearchParams } from '@/libraries/nextjs/shim';
import { CollapseController } from '@/libraries/ui/headless/collapse-controller';
import { Button } from '@/libraries/ui/primitives/button';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Link } from '@/libraries/ui/primitives/link';
import { NAVBAR_CONFIG } from '../../injection/navbar-config.key';

type NavbarProps = {
  searchSlot?: ReactNode;
  filtersSlot?: ReactNode;
};

const HomeLink = ({
  homeUrl,
  logoUrl,
  appName
}: {
  homeUrl: string;
  logoUrl: string | undefined;
  appName: string | undefined;
}) => {
  const urlSearchParams = useSearchParams();
  const searchParams = new URLSearchParams(urlSearchParams);

  return (
    <Link
      href={hrefWithSearchParams(homeUrl)(searchParams, ['page'])}
      title="Retour à l'accueil"
      className='font-bold text-xl text-base-title flex items-center gap-2'
      kind='link-hover'
    >
      {/* biome-ignore lint/performance/noImgElement: next/image requires server access to public/ which is not available in standalone mode */}
      {logoUrl && <img src={logoUrl} alt={appName ?? 'Logo'} className='h-8' />}
      {appName}
    </Link>
  );
};

const HomeLinkFallback = ({
  homeUrl,
  logoUrl,
  appName
}: {
  homeUrl: string;
  logoUrl: string | undefined;
  appName: string | undefined;
}) => (
  <Link
    href={homeUrl}
    title="Retour à l'accueil"
    className='font-bold text-xl text-base-title flex items-center gap-2'
    kind='link-hover'
  >
    {/* biome-ignore lint/performance/noImgElement: next/image requires server access to public/ which is not available in standalone mode */}
    {logoUrl && <img src={logoUrl} alt={appName ?? 'Logo'} className='h-8' />}
    {appName}
  </Link>
);

export const Navbar = ({ searchSlot, filtersSlot }: NavbarProps) => {
  const { logoUrl, appName, helpUrl, helpLabel, homeUrl = '/' } = inject(NAVBAR_CONFIG);

  const hasAppName = Boolean(appName);
  const hasHelp = Boolean(helpUrl);
  const hasBrand = Boolean(logoUrl) || hasAppName;

  return (
    <CollapseController>
      {({ toggle, collapsible }) => (
        <div className='px-8 py-4 shadow z-1'>
          <div className='flex gap-2 justify-between'>
            {hasBrand && (
              <Suspense fallback={<HomeLinkFallback homeUrl={homeUrl} logoUrl={logoUrl} appName={appName} />}>
                <HomeLink homeUrl={homeUrl} logoUrl={logoUrl} appName={appName} />
              </Suspense>
            )}
            <div className='flex'>
              {hasHelp && helpUrl && (
                <ButtonLink href={helpUrl} kind='btn-link' className='no-underline'>
                  <RiQuestionFill size={16} />
                  {helpLabel ?? 'Aide'}
                </ButtonLink>
              )}
              <Button kind='btn-link' className='px-2 lg:hidden' {...toggle}>
                <RiMenuLine size={24} aria-hidden={true} />
              </Button>
            </div>
          </div>
          <div className='mt-3 flex gap-2 flex-col 2xl:flex-row justify-between'>
            {searchSlot && <div>{searchSlot}</div>}
            {filtersSlot && (
              <div
                {...collapsible({
                  className: 'collapse lg:collapse-open w-fit'
                })}
              >
                <div className='collapse-content py-1! pl-0! pr-1!'>
                  <Suspense fallback={<div>Chargement...</div>}>{filtersSlot}</Suspense>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </CollapseController>
  );
};
