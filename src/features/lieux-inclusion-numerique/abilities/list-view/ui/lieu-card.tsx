import type { ReactNode } from 'react';
import { RiMapPin2Line, RiPhoneLine } from 'react-icons/ri';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { ConumLogo, FranceServicesLogo } from '@/libraries/ui/logos';
import { LieuLogo } from '@/libraries/ui/logos/lieu.logo';
import { Badge } from '@/libraries/ui/primitives/badge';
import { Card } from '@/libraries/ui/primitives/card';
import { cn } from '@/libraries/utils';
import { OpenBadge } from './open-badge';

type LieuCardProps = Omit<LieuListItem, 'id' | 'region' | 'departement'> & {
  size: 'md' | 'lg';
  className?: string;
};

export const LieuCard = ({
  nom,
  adresse,
  telephone,
  distance,
  horaires,
  isByAppointment,
  isFranceServices,
  isConum,
  size,
  className
}: LieuCardProps): ReactNode => (
  <Card kind='card-border' className={className} data-testid='lieu-card'>
    <div className='card-body'>
      <div className='flex justify-between gap-4'>
        <div>
          <h2 className={cn('card-title text-primary', size === 'lg' && 'text-xl')}>{nom}</h2>
          {(horaires || isByAppointment) && (
            <div className={cn('flex gap-2', size === 'md' && 'mt-2', size === 'lg' && 'mt-3')}>
              {horaires && <OpenBadge horaires={horaires} />}
              {isByAppointment && (
                <Badge color='badge-info' scale='badge-sm' className='font-bold uppercase'>
                  Sur rendez-vous
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className='flex gap-1'>
          {isFranceServices && <FranceServicesLogo />}
          {isConum && <ConumLogo />}
          {!isFranceServices && !isConum && <LieuLogo />}
        </div>
      </div>
      {size === 'md' && (
        <div className='flex gap-1 justify-between text-neutral'>
          <div>{adresse.commune}</div>
          {distance && <div>à {distance} Km</div>}
        </div>
      )}
      {size === 'lg' && (
        <div className='text-base'>
          {telephone && (
            <div className='flex gap-2 items-center'>
              <RiPhoneLine aria-hidden={true} /> {telephone}
            </div>
          )}
          <div className='flex gap-2 items-center'>
            <RiMapPin2Line aria-hidden={true} />
            {adresse.nom_voie}
            {adresse.repetition} {adresse.nom_voie}, {adresse.code_postal} {adresse.commune}
          </div>
        </div>
      )}
    </div>
  </Card>
);
