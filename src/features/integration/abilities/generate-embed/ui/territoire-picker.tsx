'use client';

import { Select } from '@arckit/daisyui/primitives';
import { useId, useState } from 'react';
import {
  type Commune,
  type Epci,
  type Territoire,
  type TerritoireType,
  territoireFromCommune,
  territoireFromDepartement,
  territoireFromEpci,
  territoireFromRegion
} from '@/features/integration/domain';
import { type Departement, departements, type Region, regions } from '@/libraries/collectivites';
import { inject } from '@/libraries/injection';
import { TERRITOIRE_SOURCE } from '../injection/territoire-source.key';
import { TerritoireSearch } from './territoire-search';

const TERRITOIRE_TYPES: { value: TerritoireType; label: string }[] = [
  { value: 'region', label: 'Région' },
  { value: 'departement', label: 'Département' },
  { value: 'epci', label: 'Intercommunalité' },
  { value: 'commune', label: 'Commune' }
];

const epciDetail = ({ communes }: Epci): string => `${communes.length} communes`;

const byNom = (a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom, 'fr');

const sortedRegions: Region[] = [...regions].sort(byNom);
const sortedDepartements: Departement[] = [...departements].sort((a, b) =>
  a.code.localeCompare(b.code, 'fr', { numeric: true })
);

type TerritoirePickerProps = {
  onChange: (territoire: Territoire | null) => void;
};

export const TerritoirePicker = ({ onChange }: TerritoirePickerProps) => {
  const [type, setType] = useState<TerritoireType>('departement');
  const selectId = useId();
  const { searchCommunes, searchEpcis } = inject(TERRITOIRE_SOURCE);

  const changeType = (nextType: TerritoireType) => {
    setType(nextType);
    onChange(null);
  };

  const selectEpci = (epci: Epci) => onChange(territoireFromEpci(epci, departements, regions));

  const selectCommune = (commune: Commune) => onChange(territoireFromCommune(commune, departements, regions));

  return (
    <div className='flex flex-col gap-4'>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend text-base'>Échelle du territoire</legend>
        <div className='flex flex-wrap gap-4'>
          {TERRITOIRE_TYPES.map(({ value, label }) => (
            <label key={value} className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                name='territoire-type'
                className='radio radio-primary'
                value={value}
                checked={type === value}
                onChange={() => changeType(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {type === 'region' && (
        <div>
          <label htmlFor={selectId} className='label mb-1'>
            Région
          </label>
          <Select
            id={selectId}
            className='w-full bg-input'
            defaultValue=''
            onChange={(event) => {
              const region = sortedRegions.find(({ code }) => code === event.target.value);
              onChange(region ? territoireFromRegion(region) : null);
            }}
          >
            <option value='' disabled>
              Sélectionnez une région
            </option>
            {sortedRegions.map(({ code, nom }) => (
              <option key={code} value={code}>
                {nom}
              </option>
            ))}
          </Select>
        </div>
      )}
      {type === 'departement' && (
        <div>
          <label htmlFor={selectId} className='label mb-1'>
            Département
          </label>
          <Select
            id={selectId}
            className='w-full bg-input'
            defaultValue=''
            onChange={(event) => {
              const departement = sortedDepartements.find(({ code }) => code === event.target.value);
              onChange(departement ? territoireFromDepartement(departement, regions) : null);
            }}
          >
            <option value='' disabled>
              Sélectionnez un département
            </option>
            {sortedDepartements.map(({ code, nom }) => (
              <option key={code} value={code}>
                {code} - {nom}
              </option>
            ))}
          </Select>
        </div>
      )}
      {type === 'epci' && (
        <TerritoireSearch
          key='epci'
          label='Intercommunalité (communauté de communes, agglomération, métropole)'
          placeholder="Nom de l'intercommunalité"
          search={searchEpcis}
          onSelect={selectEpci}
          itemToDetail={epciDetail}
        />
      )}
      {type === 'commune' && (
        <TerritoireSearch
          key='commune'
          label='Commune'
          placeholder='Nom ou code postal'
          search={searchCommunes}
          onSelect={selectCommune}
        />
      )}
    </div>
  );
};
