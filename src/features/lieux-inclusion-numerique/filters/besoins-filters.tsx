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

const apprentissageOptions = [
  {
    label: 'Maîtrise des outils numériques du quotidien',
    value: 'Maîtrise des outils numériques du quotidien',
    id: 'maitrise-des-outils-numeriques-du-quotidien'
  },
  {
    label: 'Utilisation sécurisée du numérique',
    value: 'Utilisation sécurisée du numérique',
    id: 'utilisation-securisee-du-numerique'
  },
  {
    label: 'Parentalité et éducation avec le numérique',
    value: 'Parentalité et éducation avec le numérique',
    id: 'parentalite-et-education-avec-le-numerique'
  },
  { label: 'Loisirs et créations numériques', value: 'Loisirs et créations numériques', id: 'loisirs-et-creations-numeriques' },
  {
    label: 'Compréhension du monde numérique',
    value: 'Compréhension du monde numérique',
    id: 'comprehension-du-monde-numerique'
  }
];

const demarchesOptions = [
  {
    label: 'Aide aux démarches administratives',
    value: 'Aide aux démarches administratives',
    id: 'aide-aux-demarches-administratives'
  },
  {
    label: 'Insertion professionnelle via le numérique',
    value: 'Insertion professionnelle via le numérique',
    id: 'insertion-professionnelle-via-le-numerique'
  }
];

const materielOptions = [
  {
    label: 'Accès internet et matériel informatique',
    value: 'Accès internet et matériel informatique',
    id: 'acces-internet-et-materiel-informatique'
  },
  {
    label: 'Acquisition de matériel informatique à prix solidaire',
    value: 'Acquisition de matériel informatique à prix solidaire',
    id: 'acquisition-de-materiel-informatique-a-prix-solidaire'
  }
];

export const BesoinsFilters = () => {
  const router = useRouter();
  const [, startTransition] = useTransitionWithCallback(endLoad);

  const [services, setServices] = useQueryState('services', { defaultValue: '' });

  const defaultValues = {
    services: services.split(',').filter(noEmptyString)
  };

  const selectedFiltersCount = defaultValues.services.length;

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (arraysEqual(defaultValues.services)(value.services)) return;

      startTransition(async () => {
        await setServices(value.services.filter(noEmptyString).join(','));
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
        trigger={<Trigger>Besoins</Trigger>}
        className='border-base-200 rounded'
        contentClassName='w-110 ring ring-base-100 mt-2'
        color='btn-primary'
        kind='btn-outline'
        onClose={form.handleSubmit}
      >
        <div className='p-8 border-b border-b-base-200'>
          <p className='font-bold text-sm mb-2'>Apprentissage</p>
          <div className='flex flex-col gap-2'>
            <form.AppField name='services'>
              {(field) => <field.CheckboxGroup options={apprentissageOptions} isPending={false} />}
            </form.AppField>
          </div>
        </div>
        <div className='p-8 border-b border-b-base-200'>
          <p className='font-bold text-sm mb-2'>Démarches</p>
          <div className='flex flex-col gap-2'>
            <form.AppField name='services'>
              {(field) => <field.CheckboxGroup options={demarchesOptions} isPending={false} />}
            </form.AppField>
          </div>
        </div>
        <div className='p-8'>
          <p className='font-bold text-sm mb-2'>Matériel</p>
          <div className='flex flex-col gap-2'>
            <form.AppField name='services'>
              {(field) => <field.CheckboxGroup options={materielOptions} isPending={false} />}
            </form.AppField>
          </div>
        </div>
      </Popover>
    </IndicatorBadge>
  );
};
