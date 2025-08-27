import type { ComponentType } from 'react';
import { RiCheckLine } from 'react-icons/ri';
import { InternetIcon } from '@/libraries/ui/pictograms/digital/InternetIcon';
import { SittingAtATableIcon } from '@/libraries/ui/pictograms/user/SittingAtATableIcon';
import { TeacherIcon } from '@/libraries/ui/pictograms/user/TeacherIcon';
import { PairIcon } from '@/libraries/ui/pictograms/work/PairIcon';

const typesAccompagnementIcons: Record<string, ComponentType<{ width?: number; height?: number }>> = {
  'Accompagnement individuel': SittingAtATableIcon,
  'Dans un atelier collectif': TeacherIcon,
  'En autonomie': PairIcon,
  'À distance': InternetIcon
};

type AccompagnementProps = {
  labels: string[];
  services: {
    competences: string[];
    cultureNumerique: string[];
    materielInformatique: string[];
  };
  typesAccompagnement: string[];
};

export const Accompagnement = ({ labels, services, typesAccompagnement }: AccompagnementProps) => (
  <>
    <h2 className='text-xl text-base-title font-bold mb-4'>Services & types d’accompagnement</h2>
    {labels.length > 0 && (
      <>
        <h3 className='font-bold uppercase text-xs text-base-title mt-4 mb-2'>Labellisation et certification</h3>
        <ul>
          {labels.map((label: string) => (
            <li key={label} className='badge tag badge-base-200 text-base-title badge-soft'>
              <RiCheckLine aria-hidden={true} />
              {label}
            </li>
          ))}
        </ul>
      </>
    )}
    {services.competences.length > 0 && (
      <>
        <h3 className='font-bold uppercase text-xs text-base-title mt-5 mb-2'>Compétences numériques de base</h3>
        <ul className='list-disc leading-7 pl-5'>
          {services.competences.map((service: string) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </>
    )}
    {services.cultureNumerique.length > 0 && (
      <>
        <h3 className='font-bold uppercase text-xs text-base-title mt-4 mb-2'>Culture numérique</h3>
        <ul className='list-disc leading-7 pl-5'>
          {services.cultureNumerique.map((service: string) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </>
    )}
    {services.materielInformatique.length > 0 && (
      <>
        <h3 className='font-bold uppercase text-xs text-base-title mt-4 mb-2'>Matériel informatique</h3>
        <ul className='list-disc leading-7 pl-5'>
          {services.materielInformatique.map((service: string) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </>
    )}
    {typesAccompagnement.length > 0 && (
      <>
        <h3 className='font-bold uppercase text-xs text-base-title mt-5 mb-2'>Types d’accompagnement</h3>
        <ul className='flex flex-wrap gap-3'>
          {typesAccompagnement.map((typeAccompagnement) => {
            const Icon = typesAccompagnementIcons[typeAccompagnement];
            return (
              <li
                key={typeAccompagnement}
                className='text-base-title flex items-center gap-3 bg-info-low pl-4 pr-5 py-1 rounded-lg'
              >
                {Icon && <Icon width={36} height={36} />}
                {typeAccompagnement}
              </li>
            );
          })}
        </ul>
      </>
    )}
  </>
);
