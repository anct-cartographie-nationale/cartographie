import type { ReactNode } from 'react';
import { ConumLogo, FranceServicesLogo } from '@/features/brand/use-cases/logos';
import { LieuLogo } from '@/features/brand/use-cases/logos/lieu.logo';
import { Badge } from '@/libraries/ui/primitives/badge';
import { Card } from '@/libraries/ui/primitives/card';

type LieuCardProps = {
  nom: string;
  commune: string;
  distance?: number;
  isOpen?: boolean;
  isByAppointment?: boolean;
  isFranceServices?: boolean;
  isConum?: boolean;
  className?: string;
};

export const LieuCard = ({
  nom,
  commune,
  distance,
  isOpen,
  isByAppointment,
  isFranceServices,
  isConum,
  className
}: LieuCardProps): ReactNode => (
  <Card kind='card-border' className={className}>
    <div className='card-body'>
      <div className='flex justify-between gap-4'>
        <div>
          <h2 className='card-title text-primary'>{nom}</h2>
          {(isOpen || isByAppointment) && (
            <div className='flex gap-2 mt-2'>
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
        <div className='flex'>
          {isFranceServices && <FranceServicesLogo />}
          {isConum && <ConumLogo />}
          {!isFranceServices && !isConum && <LieuLogo />}
        </div>
      </div>
      <div className='flex gap-1 justify-between text-muted'>
        <div>{commune}</div>
        {distance && <div>à {distance} Km</div>}
      </div>
    </div>
  </Card>
);
