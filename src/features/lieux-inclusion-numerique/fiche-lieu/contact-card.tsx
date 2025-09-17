'use client';

import { mapStyles } from 'carte-facile';
import { useTheme } from 'next-themes';
import {
  RiCalendarLine,
  RiExternalLinkLine,
  RiGlobalLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiWheelchairLine
} from 'react-icons/ri';
import { Map as MapLibre, NavigationControl } from 'react-map-gl/maplibre';
import { LieuMarker } from '@/features/cartographie/markers/lieu.marker';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';
import { Card } from '@/libraries/ui/primitives/card';
import { Link } from '@/libraries/ui/primitives/link';
import { ClientOnly } from '@/libraries/utils';

type ContactCardProps = {
  nom: string;
  latitude?: number;
  longitude?: number;
  adresse: string;
  siteInternet?: string;
  accessibilite?: string;
  telephone?: string;
  courriel?: string;
  priseRDV?: string;
};

export const ContactCard = ({
  nom,
  latitude,
  longitude,
  adresse,
  siteInternet,
  accessibilite,
  telephone,
  courriel,
  priseRDV
}: ContactCardProps) => {
  const { theme } = useTheme();

  return (
    <Card kind='card-border' className='rounded-xl overflow-hidden'>
      {latitude && longitude && (
        <ClientOnly>
          <div className={theme === 'dark' ? 'invert-90' : ''}>
            <MapLibre
              initialViewState={{
                latitude,
                longitude,
                zoom: 15
              }}
              style={{ width: '100%', height: '280px' }}
              mapStyle={mapStyles.simple}
            >
              <LieuMarker latitude={latitude} longitude={longitude} />
              <NavigationControl position='bottom-right' showCompass={false} />
            </MapLibre>
          </div>
        </ClientOnly>
      )}
      <section>
        <div className='card-body p-8'>
          <h2 className='text-xl text-base-title font-bold'>{nom}</h2>
          <ul className='text-base leading-7'>
            <li className='flex items-center gap-2'>
              <div aria-hidden={true}>
                <RiMapPin2Line />
              </div>
              <span className='sr-only'>Adresse&nbsp;:</span>
              {adresse}
            </li>
            {siteInternet && (
              <li className='flex items-center gap-2'>
                <div aria-hidden={true}>
                  <RiGlobalLine />
                </div>
                <span className='sr-only'>Site internet&nbsp;:</span>
                <Link color='link-primary' href={siteInternet} target='_blank' rel='noopener noreferrer'>
                  {siteInternet}&nbsp;
                  <RiExternalLinkLine className='inline-flex' aria-hidden={true} />
                </Link>
              </li>
            )}
            {accessibilite && (
              <li className='flex items-center gap-2'>
                <div aria-hidden={true}>
                  <RiWheelchairLine />
                </div>
                <Link color='link-primary' href={accessibilite} target='_blank' rel='noopener noreferrer'>
                  Informations d’accessibilité du lieu&nbsp;
                  <RiExternalLinkLine className='inline-flex' aria-hidden={true} />
                </Link>
              </li>
            )}
          </ul>
        </div>
        {(telephone || courriel) && (
          <>
            <hr className='border-base-200' />
            <div className='card-body p-8'>
              <h3 className='font-bold uppercase text-xs text-base-title mb-2'>Contactez un conseiller France Services</h3>
              <ul className='text-base leading-7'>
                {telephone && (
                  <li className='flex items-center gap-2'>
                    <div aria-hidden={true}>
                      <RiPhoneLine />
                    </div>
                    <span className='sr-only'>Numéro de téléphone&nbsp;:</span>
                    {telephone}
                  </li>
                )}
                {courriel && (
                  <li className='flex items-center gap-2'>
                    <div aria-hidden={true}>
                      <RiMailLine />
                    </div>
                    <span className='sr-only'>Courriel&nbsp;:</span>
                    <Link color='link-primary' href={`mailto:${courriel}`}>
                      {courriel}&nbsp;
                      <RiExternalLinkLine className='inline-flex' aria-hidden={true} />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
        {priseRDV && (
          <div className='card-body bg-info-low p-8'>
            <h3 className='font-bold uppercase text-xs text-base-title mb-2'>contactez un médiateur numérique</h3>
            <ButtonLink href={priseRDV} color='btn-primary' target='_blank' rel='noopener noreferrer'>
              <RiCalendarLine aria-hidden={true} />
              Prendre Rendez-vous
            </ButtonLink>
          </div>
        )}
      </section>
    </Card>
  );
};
