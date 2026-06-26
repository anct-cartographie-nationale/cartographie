'use client';

import { IndicatorBadge } from '@arckit/daisyui/primitives';
import { Popover, Trigger } from '@arckit/daisyui/primitives-client';
import { useAppForm } from '@arckit/form';
import { endLoad, startLoad } from '@/libraries/map';
import { useQueryState, useRouter } from '@/libraries/nextjs/shim';
import { arraysEqual } from '@/libraries/utils/array';
import { noEmptyString } from '@/libraries/utils/string';
import { useTransitionWithCallback } from '@/libraries/utils/use-transition-with-callback';

const fraisAChargeOptions = [{ label: 'Gratuit', value: 'Gratuit', id: 'gratuit' }];

const priseRdvOptions = [{ label: 'Prise de RDV en ligne', value: 'Prise de RDV en ligne', id: 'prise-de-rdv-en-ligne' }];

const ouvertActuellementOptions = [{ label: 'Ouvert actuellement', value: 'true', id: 'ouvert-actuellement' }];

const ouvertLeWeekEndOptions = [{ label: 'Ouvert le week-end', value: 'true', id: 'ouvert-le-week-end' }];

const roundToQuarterHour = (date: Date): string => {
  const rounded = new Date(date);
  rounded.setMinutes(Math.floor(rounded.getMinutes() / 15) * 15, 0, 0);
  return rounded.toISOString();
};

export const DisponibiliteFilters = ({ sources }: { sources: string[] }) => {
  const router = useRouter();
  const [, startTransition] = useTransitionWithCallback(endLoad);

  const [fraisACharge, setFraisACharge] = useQueryState('frais_a_charge', { defaultValue: '' });
  const [priseRdv, setPriseRdv] = useQueryState('prise_rdv', { defaultValue: '' });
  const [ouvertActuellement, setOuvertActuellement] = useQueryState('ouvert_actuellement', { defaultValue: '' });
  const [ouvertLeWeekEnd, setOuvertLeWeekEnd] = useQueryState('ouvert_le_week_end', { defaultValue: '' });
  const [source, setSource] = useQueryState('source', { defaultValue: '' });

  const sourceOptions = source && !sources.includes(source) ? [source, ...sources] : sources;

  const defaultValues = {
    fraisACharge: fraisACharge.split(',').filter(noEmptyString),
    priseRdv: priseRdv.split(',').filter(noEmptyString),
    ouvertActuellement: ouvertActuellement ? ['true'] : [],
    ouvertLeWeekEnd: ouvertLeWeekEnd ? ['true'] : [],
    source
  };

  const selectedFiltersCount =
    defaultValues.fraisACharge.length +
    defaultValues.priseRdv.length +
    defaultValues.ouvertActuellement.length +
    defaultValues.ouvertLeWeekEnd.length +
    (defaultValues.source ? 1 : 0);

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (
        arraysEqual(defaultValues.fraisACharge)(value.fraisACharge) &&
        arraysEqual(defaultValues.priseRdv)(value.priseRdv) &&
        arraysEqual(defaultValues.ouvertActuellement)(value.ouvertActuellement) &&
        arraysEqual(defaultValues.ouvertLeWeekEnd)(value.ouvertLeWeekEnd) &&
        defaultValues.source === value.source
      )
        return;

      startTransition(async () => {
        await setFraisACharge(value.fraisACharge.filter(noEmptyString).join(','));
        await setPriseRdv(value.priseRdv.filter(noEmptyString).join(','));
        await setOuvertActuellement(value.ouvertActuellement.includes('true') ? roundToQuarterHour(new Date()) : '');
        await setOuvertLeWeekEnd(value.ouvertLeWeekEnd.includes('true') ? 'true' : '');
        await setSource(value.source);
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
        trigger={<Trigger>Disponibilité</Trigger>}
        className='border-base-200 rounded'
        contentClassName='w-110 ring ring-base-100 mt-2'
        color='btn-primary'
        kind='btn-outline'
        onClose={form.handleSubmit}
      >
        <div className='p-8 flex flex-col gap-2'>
          <form.AppField name='ouvertActuellement'>
            {(field) => <field.CheckboxGroup options={ouvertActuellementOptions} isPending={false} />}
          </form.AppField>
          <form.AppField name='ouvertLeWeekEnd'>
            {(field) => <field.CheckboxGroup options={ouvertLeWeekEndOptions} isPending={false} />}
          </form.AppField>
          <form.AppField name='fraisACharge'>
            {(field) => <field.CheckboxGroup options={fraisAChargeOptions} isPending={false} />}
          </form.AppField>
          <form.AppField name='priseRdv'>
            {(field) => <field.CheckboxGroup options={priseRdvOptions} isPending={false} />}
          </form.AppField>
          <div className='flex flex-col gap-2'>
            <p className='font-bold text-sm'>Source</p>
            <form.AppField name='source'>
              {(field) => (
                <field.Select isPending={false} aria-label='Source de données'>
                  <option value=''>Toutes les sources</option>
                  {sourceOptions.map((sourceOption) => (
                    <option key={sourceOption} value={sourceOption}>
                      {sourceOption}
                    </option>
                  ))}
                </field.Select>
              )}
            </form.AppField>
          </div>
        </div>
      </Popover>
    </IndicatorBadge>
  );
};
