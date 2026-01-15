'use client';

import { useId } from 'react';
import { RiCloseCircleFill, RiSearchLine } from 'react-icons/ri';
import { type Address, addressCombobox, addressOptions } from '@/features/address';
import { useRouter } from '@/libraries/next-shim';
import { useSubscribe } from '@/libraries/reactivity/Subscribe';
import { Button } from '@/libraries/ui/primitives/button';
import { ComboBox } from '@/libraries/ui/primitives/combobox';
import { Input } from '@/libraries/ui/primitives/input';
import { Options } from '@/libraries/ui/primitives/options';
import { cn } from '@/libraries/utils';
import { HighlightCommune, removeHighlightDecoupageAdministratif } from './layers/highlight-decoupage-administratif';
import { map$ } from './map/streams/map.stream';

export const SearchAddress = ({ className }: { className?: string }) => {
  const inputId = useId();
  const router = useRouter();
  const [map] = useSubscribe(map$);

  return (
    <ComboBox
      {...addressCombobox}
      onSelectedItemChange={(address: Address) => {
        if (address.x && address.y && map) {
          HighlightCommune(map, address.citycode);
          map.flyTo({
            center: [address.y, address.x],
            zoom: 13,
            duration: 400
          });
        }
        if (address.lieuId) {
          router.push(`/lieux/${address.lieuId}`);
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
                      options.reset();
                      map && removeHighlightDecoupageAdministratif(map);
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
