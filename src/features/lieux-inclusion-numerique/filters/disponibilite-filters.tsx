'use client';

import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useAppForm } from '@/libraries/form';
import { IndicatorBadge } from '@/libraries/ui/primitives/indicator-badge';
import { Popover, Trigger } from '@/libraries/ui/primitives/popover';
import { arraysEqual } from '@/libraries/utils/array';
import { noEmptyString } from '@/libraries/utils/string';

const fraisAChargeOptions = [{ label: 'Gratuit', value: 'Gratuit', id: 'gratuit' }];

const priseRdvOptions = [{ label: 'Prise de RDV en ligne', value: 'Prise de RDV en ligne', id: 'prise-de-rdv-en-ligne' }];

export const DisponibiliteFilters = () => {
  const router = useRouter();

  const [fraisACharge, setFraisACharge] = useQueryState('frais_a_charge', { defaultValue: '' });
  const [priseRdv, setPriseRdv] = useQueryState('prise_rdv', { defaultValue: '' });

  const defaultValues = {
    fraisACharge: fraisACharge.split(',').filter(noEmptyString),
    priseRdv: priseRdv.split(',').filter(noEmptyString)
  };

  const selectedFiltersCount = defaultValues.fraisACharge.length + defaultValues.priseRdv.length;

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (arraysEqual(defaultValues.fraisACharge)(value.fraisACharge) && arraysEqual(defaultValues.priseRdv)(value.priseRdv))
        return;

      await setFraisACharge(value.fraisACharge.filter(noEmptyString).join(','));
      await setPriseRdv(value.priseRdv.filter(noEmptyString).join(','));
      router.refresh();
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
        trigger={<Trigger>Disponibilité</Trigger>}
        className='border-base-200 rounded'
        contentClassName='w-110 ring ring-base-100 mt-2'
        color='btn-primary'
        kind='btn-outline'
        onClose={form.handleSubmit}
      >
        <div className='p-8 border-b-base-200 border-b flex flex-col gap-2'>
          <form.AppField name='fraisACharge'>
            {(field) => <field.CheckboxGroup options={fraisAChargeOptions} isPending={false} />}
          </form.AppField>
          <form.AppField name='priseRdv'>
            {(field) => <field.CheckboxGroup options={priseRdvOptions} isPending={false} />}
          </form.AppField>
        </div>
      </Popover>
    </IndicatorBadge>
  );
};
