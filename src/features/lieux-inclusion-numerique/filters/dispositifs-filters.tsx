'use client';

import { useQueryState } from 'nuqs';
import { useAppForm } from '@/libraries/form';
import { useRouter } from '@/libraries/next-shim';
import { IndicatorBadge } from '@/libraries/ui/primitives/indicator-badge';
import { Popover, Trigger } from '@/libraries/ui/primitives/popover';
import { arraysEqual } from '@/libraries/utils/array';
import { noEmptyString } from '@/libraries/utils/string';
import { useTransitionWithCallback } from '@/libraries/utils/use-transition-with-callback';
import { endLoad, startLoad } from '../load/load.stream';

const dispositifsOptions = [
  { label: 'Conseillers numériques', value: 'Conseillers numériques', id: 'conseillers-numeriques' },
  { label: 'France Services', value: 'France Services', id: 'france-services' }
];

export const DispositifsFilters = () => {
  const router = useRouter();
  const [, startTransition] = useTransitionWithCallback(endLoad);

  const [dispositifProgrammesNationaux, setDispositifProgrammesNationaux] = useQueryState('dispositif_programmes_nationaux', {
    defaultValue: ''
  });

  const defaultValues = {
    dispositifProgrammesNationaux: dispositifProgrammesNationaux.split(',').filter(noEmptyString)
  };

  const selectedFiltersCount = defaultValues.dispositifProgrammesNationaux.length;

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (arraysEqual(defaultValues.dispositifProgrammesNationaux)(value.dispositifProgrammesNationaux)) return;

      startTransition(async () => {
        await setDispositifProgrammesNationaux(value.dispositifProgrammesNationaux.filter(noEmptyString).join(','));
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
        trigger={<Trigger>Dispositifs</Trigger>}
        className='border-base-200 rounded'
        contentClassName='w-110 ring ring-base-100 mt-2'
        color='btn-primary'
        kind='btn-outline'
        onClose={form.handleSubmit}
      >
        <div className='p-8 border-b-base-200 border-b flex flex-col gap-2'>
          <form.AppField name='dispositifProgrammesNationaux'>
            {(field) => <field.CheckboxGroup options={dispositifsOptions} isPending={false} />}
          </form.AppField>
        </div>
      </Popover>
    </IndicatorBadge>
  );
};
