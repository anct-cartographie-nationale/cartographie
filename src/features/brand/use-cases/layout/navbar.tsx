'use client';

import { Suspense } from 'react';
import { RiMenuLine, RiQuestionFill } from 'react-icons/ri';
import { Geolocate } from '@/features/cartographie/geolocate';
import { SearchAddress } from '@/features/cartographie/search-address';
import { BesoinsFilters } from '@/features/lieux-inclusion-numerique/filters/besoins-filters';
import { DisponibiliteFilters } from '@/features/lieux-inclusion-numerique/filters/disponibilite-filters';
import { DispositifsFilters } from '@/features/lieux-inclusion-numerique/filters/dispositifs-filters';
import { PublicCibleFilters } from '@/features/lieux-inclusion-numerique/filters/public-cible-filters';
import { TerritoiresPrioritairesFilters } from '@/features/lieux-inclusion-numerique/filters/territoires-prioritaires-filters';
import { inject, NAVBAR_CONFIG } from '@/libraries/injection';
import { Image } from '@/libraries/next-shim';
import { CollapseController } from '@/libraries/ui/headless/collapse-controller';
import { Button } from '@/libraries/ui/primitives/button';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Link } from '@/libraries/ui/primitives/link';

export const Navbar = () => {
  const { logoUrl, appName, helpUrl, helpLabel } = inject(NAVBAR_CONFIG);

  const hasAppName = Boolean(appName);
  const hasHelp = Boolean(helpUrl);
  const hasBrand = Boolean(logoUrl) || hasAppName;

  return (
    <CollapseController>
      {({ toggle, collapsible }) => (
        <div className='px-8 py-4 shadow z-1'>
          <div className='flex gap-2 justify-between'>
            {hasBrand && (
              <Link
                href='/'
                title="Retour à l'accueil"
                className='font-bold text-xl text-base-title flex items-center gap-2'
                kind='link-hover'
              >
                {logoUrl && <Image src={logoUrl} alt={appName ?? 'Logo'} width={32} height={32} className='h-8 w-auto' />}
                {hasAppName && appName}
              </Link>
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
            <div>
              <div className='flex gap-2'>
                <SearchAddress className='sm:w-100 w-full pr-0' />
                <Geolocate />
              </div>
            </div>
            <div
              {...collapsible({
                className: 'collapse lg:collapse-open w-fit'
              })}
            >
              <div className='collapse-content py-1! pl-0! pr-1!'>
                <Suspense fallback={<div>Chargement...</div>}>
                  <BesoinsFilters />
                  <PublicCibleFilters />
                  <DisponibiliteFilters />
                  <DispositifsFilters />
                  <TerritoiresPrioritairesFilters />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </CollapseController>
  );
};
