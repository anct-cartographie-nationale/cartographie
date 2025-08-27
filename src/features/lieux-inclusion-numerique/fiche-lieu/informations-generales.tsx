'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { FranceServicesLogo } from '@/features/brand/use-cases/logos';
import { Button } from '@/libraries/ui/primitives/button';
import { WeekDay } from './opening-hours.presenter';
import { OpeningState } from './opening-state';
import { TimeTable } from './time-table';

type InformationsGeneralesProps = {
  nom: string;
  osmOpeningHours?: string;
  isFranceServices?: boolean;
};

export const InformationsGenerales = ({ nom, osmOpeningHours, isFranceServices = false }: InformationsGeneralesProps) => {
  const [openHoursIsVisible, setOpenHoursIsVisible] = useState(false);

  return (
    <>
      <div className='flex sm:flex-row flex-col justify-between items-center gap-6'>
        <h1 className='text-4xl text-base-title font-bold'>{nom}</h1>
        {isFranceServices && (
          <div>
            <FranceServicesLogo width={96} height={96} className='border-1 border-base-200 rounded-lg' />
          </div>
        )}
      </div>
      {osmOpeningHours && (
        <>
          <div className='flex sm:flex-row flex-col gap-4 justify-between items-center mt-2'>
            <OpeningState osmOpeningHours={osmOpeningHours} />
            <Button kind='btn-ghost' type='button' onClick={() => setOpenHoursIsVisible(!openHoursIsVisible)}>
              {openHoursIsVisible ? (
                <>
                  Masquer les horaires <RiArrowUpSLine size={24} className='text-primary' aria-hidden={true} />
                </>
              ) : (
                <>
                  Afficher les horaires <RiArrowDownSLine size={24} className='text-primary' aria-hidden={true} />
                </>
              )}
            </Button>
          </div>
          <AnimatePresence>
            {openHoursIsVisible && (
              <motion.div
                className='mt-3 overflow-hidden'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <span className='text-muted'>Horaires d’ouverture du lieu</span>
                <TimeTable
                  osmOpeningHours={osmOpeningHours}
                  daysOfWeek={{
                    'Lun.': WeekDay.Monday,
                    'Mar.': WeekDay.Tuesday,
                    'Mer.': WeekDay.Wednesday,
                    'Jeu.': WeekDay.Thursday,
                    'Ven.': WeekDay.Friday,
                    'Sam.': WeekDay.Saturday,
                    'Dim.': WeekDay.Sunday
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};
