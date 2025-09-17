import type { ReactNode } from 'react';
import { RiMapPin2Line, RiPhoneLine } from 'react-icons/ri';
import { ConumLogo, FranceServicesLogo } from '@/features/brand/use-cases/logos';
import { LieuLogo } from '@/features/brand/use-cases/logos/lieu.logo';
import { Badge } from '@/libraries/ui/primitives/badge';
import { Card } from '@/libraries/ui/primitives/card';
import { cn } from '@/libraries/utils';
import type { LieuListItem } from './lieu-list-item';

type LieuCardProps = Omit<LieuListItem, 'id' | 'region' | 'departement'> & {
  size: 'md' | 'lg';
  className?: string;
};

export const LieuCard = ({
  nom,
  adresse,
  commune,
  codePostal,
  telephone,
  distance,
  isOpen,
  isByAppointment,
  isFranceServices,
  isConum,
  size,
  className
}: LieuCardProps): ReactNode => (
  <Card kind='card-border' className={className}>
    <div className='card-body'>
      <div className='flex justify-between gap-4'>
        <div>
          <h2 className={cn('card-title text-primary', size === 'lg' && 'text-xl')}>{nom}</h2>
          {(isOpen || isByAppointment) && (
            <div className={cn('flex gap-2', size === 'md' && 'mt-2', size === 'lg' && 'mt-3')}>
              {isOpen && (
                <Badge color='badge-success' scale='badge-sm' className='font-bold uppercase'>
                  Ouvert
                </Badge>
              )}
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
        <div className='flex gap-1 justify-between text-muted'>
          <div>{commune}</div>
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
            {adresse}, {codePostal} {commune}
          </div>
        </div>
      )}
    </div>
  </Card>
);
