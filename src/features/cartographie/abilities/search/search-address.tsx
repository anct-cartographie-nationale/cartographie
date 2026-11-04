'use client';

import { Button, Input } from '@arckit/daisyui/primitives';
import { useId } from 'react';
import { RiCloseCircleFill, RiSearchLine } from 'react-icons/ri';
import { TrackerAction, TrackerCategory, trackEvent } from '@/configuration/telemetry/event-tracker';
import { collectivitesFromInsee } from '@/libraries/collectivites';
import type { Address } from '@/libraries/geoplateforme';
import { AUTOUR_PATH, autourHref, autourKey, withoutAutourParams } from '@/libraries/inclusion-numerique-api/filters/autour';
import { map$ } from '@/libraries/map';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { usePathname, useRouter, useSearchParams } from '@/libraries/nextjs/shim';
import { useSubscribe } from '@/libraries/reactivity/Subscribe';
import { ComboBox } from '@/libraries/ui/primitives/combobox';
import { Options } from '@/libraries/ui/primitives/options';
import { cn } from '@/libraries/utils';
import { highlightCommune, removeHighlightDecoupageAdministratif } from '@/shared/ui/highlight-decoupage-administratif';
import { requestResultsFocus } from '@/shared/ui/results-focus.stream';
import { addressCombobox, addressOptions } from './address-combobox';

const territoireHref = (commune: string | undefined, searchParams: URLSearchParams): string => {
  const collectivites = commune ? collectivitesFromInsee(commune) : undefined;
  const path = collectivites ? `/${collectivites.region.slug}/${collectivites.departement.slug}` : '/';
  return hrefWithSearchParams(path)(withoutAutourParams(searchParams), ['page']);
};

export const SearchAddress = ({ className }: { className?: string }) => {
  const inputId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [map] = useSubscribe(map$);

  return (
    <ComboBox
      {...addressCombobox}
      onSelectedItemChange={(address: Address) => {
        trackEvent({
          category: TrackerCategory.SEARCH,
          action: TrackerAction.SEARCH_SELECT,
          name: address.lieuId ? 'lieu' : address.citycode ? 'commune' : 'adresse'
        });
        if (address.lieuId) {
          if (address.x && address.y && map) {
            highlightCommune(map, address.citycode);
            map.flyTo({ center: [address.y, address.x], zoom: 13, duration: 400 });
          }
          router.push(`/lieux/${address.lieuId}`);
          return;
        }
        if (address.x && address.y) {
          requestResultsFocus(autourKey({ lat: address.x, lng: address.y }));
          router.push(
            autourHref(
              { lat: address.x, lng: address.y, adresse: address.label, commune: address.citycode },
              new URLSearchParams(searchParams)
            ),
            { scroll: false }
          );
        }
      }}
    >
      {({ getLabelProps, getInputProps, getToggleButtonProps, ...options }) => (
        <div className='w-full sm:w-auto'>
          <label htmlFor={inputId} {...getLabelProps()} className='sr-only'>
            Rechercher une adresse
          </label>
          <Input
            className={cn(className, 'text-sm')}
            scale='input-lg'
            id={inputId}
            type='text'
            placeholder='Code postal, commune, adresse, …'
            right={
              <>
                {options.selectedItem != null && (
                  <Button
                    type='button'
                    kind='btn-link'
                    className='p-0'
                    title='Effacer la recherche'
                    onClick={() => {
                      const commune = options.selectedItem?.citycode;
                      options.reset();
                      map && removeHighlightDecoupageAdministratif(map);
                      if (pathname === AUTOUR_PATH)
                        router.push(territoireHref(commune, new URLSearchParams(searchParams)), { scroll: false });
                    }}
                  >
                    <RiCloseCircleFill size={24} />
                  </Button>
                )}
                <Button
                  color='btn-primary'
                  scale='btn-lg'
                  className='p-3'
                  title='Afficher les résultats'
                  {...getToggleButtonProps({ type: 'button' })}
                >
                  <RiSearchLine size={24} />
                </Button>
              </>
            }
            {...getInputProps()}
          />
          <Options {...options} {...addressOptions} />
        </div>
      )}
    </ComboBox>
  );
};
