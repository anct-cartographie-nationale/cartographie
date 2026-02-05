'use client';

import { useAppForm } from '@/libraries/form';
import { useQueryState, useRouter } from '@/libraries/next-shim';
import { IndicatorBadge } from '@/libraries/ui/primitives/indicator-badge';
import { Popover, Trigger } from '@/libraries/ui/primitives/popover';
import { arraysEqual } from '@/libraries/utils/array';
import { noEmptyString } from '@/libraries/utils/string';
import { useTransitionWithCallback } from '@/libraries/utils/use-transition-with-callback';
import { endLoad, startLoad } from '../load/load.stream';

const territoiresOptions = [
  { label: 'QPV', value: 'QPV', hint: 'Quartier prioritaire de la ville', id: 'qpv' },
  { label: 'FRR', value: 'ZRR', hint: 'France Ruralité Revitalisation', id: 'frr' }
];

export const TerritoiresPrioritairesFilters = () => {
  const router = useRouter();
  const [, startTransition] = useTransitionWithCallback(endLoad);

  const [autresFormationsLabels, setAutresFormationsLabels] = useQueryState('autres_formations_labels', { defaultValue: '' });

  const defaultValues = {
    autresFormationsLabels: autresFormationsLabels.split(',').filter(noEmptyString)
  };

  const selectedFiltersCount = defaultValues.autresFormationsLabels.length;

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (arraysEqual(defaultValues.autresFormationsLabels)(value.autresFormationsLabels)) return;

      startTransition(async () => {
        await setAutresFormationsLabels(value.autresFormationsLabels.filter(noEmptyString).join(','));
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
        trigger={<Trigger>Territoires prioritaires</Trigger>}
        className='border-base-200 rounded'
        contentClassName='w-110 ring ring-base-100 mt-2'
        color='btn-primary'
        kind='btn-outline'
        onClose={form.handleSubmit}
      >
        <div className='p-8 flex flex-col gap-2'>
          <form.AppField name='autresFormationsLabels'>
            {(field) => (
              <field.CheckboxGroup
                options={territoiresOptions.map(({ label, hint, ...rest }) => ({
                  label: (
                    <div className='flex flex-col leading-tight'>
                      <span>{label}</span>
                      {hint && <span className='text-xs text-base-500'>{hint}</span>}
                    </div>
                  ),
                  ...rest
                }))}
                isPending={false}
              />
            )}
          </form.AppField>
        </div>
      </Popover>
    </IndicatorBadge>
  );
};
