'use client';

import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useAppForm } from '@/libraries/form';
import { IndicatorBadge } from '@/libraries/ui/primitives/indicator-badge';
import { Popover, Trigger } from '@/libraries/ui/primitives/popover';
import { arraysEqual } from '@/libraries/utils/array';
import { noEmptyString } from '@/libraries/utils/string';
import { useTransitionWithCallback } from '@/libraries/utils/use-transition-with-callback';
import { endLoad, startLoad } from '../load/load.stream';

const publicsSpecifiquementAdressesTrancheAgeOptions = [
  { label: 'Jeunes', value: 'Jeunes', id: 'jeunes' },
  { label: 'Seniors', value: 'Seniors', id: 'seniors' }
];

const publicsSpecifiquementAdressesSituationOptions = [
  { label: 'Étudiants', value: 'Étudiants', id: 'etudiants' },
  { label: 'Familles et/ou enfants', value: 'Familles et/ou enfants', id: 'familles-et-ou-enfants' }
];

const priseEnChargeSpecifiqueSituationOptions = [
  { label: 'Langues étrangères', value: 'Langues étrangères', id: 'langues-etrangeres' }
];

const priseEnChargeSpecifiqueAccessibiliteOptions = [
  { label: 'Illettrisme', value: 'Illettrisme', id: 'illettrisme' },
  { label: 'Handicaps moteurs', value: 'Handicaps moteurs', id: 'handicaps-moteurs' },
  { label: 'Handicaps mentaux', value: 'Handicaps mentaux', id: 'handicaps-mentaux' },
  { label: 'Surdité', value: 'Surdité', id: 'surdite' },
  { label: 'Déficience visuelle', value: 'Déficience visuelle', id: 'visuelle' }
];

export const PublicCibleFilters = () => {
  const router = useRouter();
  const [, startTransition] = useTransitionWithCallback(endLoad);

  const [publicsSpecifiquementAdresses, setPublicsSpecifiquementAdresses] = useQueryState('publics_specifiquement_adresses', {
    defaultValue: ''
  });

  const [priseEnChargeSpecifique, setPriseEnChargeSpecifique] = useQueryState('prise_en_charge_specifique', {
    defaultValue: ''
  });

  const defaultValues = {
    publicsSpecifiquementAdresses: publicsSpecifiquementAdresses.split(',').filter(noEmptyString),
    priseEnChargeSpecifique: priseEnChargeSpecifique.split(',').filter(noEmptyString)
  };

  const selectedFiltersCount =
    defaultValues.publicsSpecifiquementAdresses.length + defaultValues.priseEnChargeSpecifique.length;

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (
        arraysEqual(defaultValues.publicsSpecifiquementAdresses)(value.publicsSpecifiquementAdresses) &&
        arraysEqual(defaultValues.priseEnChargeSpecifique)(value.priseEnChargeSpecifique)
      )
        return;

      startTransition(async () => {
        await Promise.all([
          setPublicsSpecifiquementAdresses(value.publicsSpecifiquementAdresses.filter(noEmptyString).join(',')),
          setPriseEnChargeSpecifique(value.priseEnChargeSpecifique.filter(noEmptyString).join(','))
        ]);
        startLoad();
        router.refresh();
      });
    }
  });

  return (
    <IndicatorBadge
      displayIndicator={selectedFiltersCount > 0}
      indicatorContent={selectedFiltersCount}
      className='!rounded-full font-bold'
      color='badge-primary'
      scale='badge-xs'
    >
      <Popover
        trigger={<Trigger>Public cible</Trigger>}
        className='border-base-200 rounded'
        contentClassName='w-110 ring ring-base-100 mt-2'
        color='btn-primary'
        kind='btn-outline'
        onClose={form.handleSubmit}
      >
        <div className='p-8 border-b border-b-base-200'>
          <p className='font-bold text-sm mb-2'>Tranche d’âge</p>
          <div className='flex flex-col gap-2'>
            <form.AppField name='publicsSpecifiquementAdresses'>
              {(field) => <field.CheckboxGroup options={publicsSpecifiquementAdressesTrancheAgeOptions} isPending={false} />}
            </form.AppField>
          </div>
        </div>
        <div className='p-8 border-b border-b-base-200'>
          <p className='font-bold text-sm mb-2'>Situation</p>
          <div className='flex flex-col gap-2'>
            <form.AppField name='publicsSpecifiquementAdresses'>
              {(field) => <field.CheckboxGroup options={publicsSpecifiquementAdressesSituationOptions} isPending={false} />}
            </form.AppField>
            <form.AppField name='priseEnChargeSpecifique'>
              {(field) => <field.CheckboxGroup options={priseEnChargeSpecifiqueSituationOptions} isPending={false} />}
            </form.AppField>
          </div>
        </div>
        <div className='p-8'>
          <p className='font-bold text-sm mb-2'>Accessibilité</p>
          <div className='flex flex-col gap-2'>
            <form.AppField name='priseEnChargeSpecifique'>
              {(field) => <field.CheckboxGroup options={priseEnChargeSpecifiqueAccessibiliteOptions} isPending={false} />}
            </form.AppField>
          </div>
        </div>
      </Popover>
    </IndicatorBadge>
  );
};
