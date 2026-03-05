import type { ComponentType } from 'react';
import {
  RiCloseCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiSurveyLine,
  RiUserHeartLine
} from 'react-icons/ri';

const modalitesAccesIcons: Record<string, ComponentType<{ size?: number }>> = {
  'Se présenter': RiMapPin2Line,
  Téléphoner: RiPhoneLine,
  'Contacter par mail': RiMailLine,
  'Prendre un RDV en ligne': RiGlobalLine,
  'Ce lieu n’accueille pas de public': RiCloseCircleLine,
  'Envoyer un mail avec une fiche de prescription': RiSurveyLine
};
type MobilisationProps = {
  fraisACharge: string[];
  modalitesAcces: string[];
  publicsSpecifiques: string[];
  prisesEnChargeSpecifiques: string[];
};

export const Mobilisation = ({
  publicsSpecifiques,
  fraisACharge,
  modalitesAcces,
  prisesEnChargeSpecifiques
}: MobilisationProps) => (
  <>
    <h2 className='text-xl text-base-title font-bold mb-4'>Comment bénéficier de ce service&nbsp;?</h2>
    {publicsSpecifiques.length > 0 ? (
      <>
        <h3 className='text-sm font-semibold pb-2'>Publics spécifiquement adressés</h3>
        <ul className='flex flex-wrap gap-2'>
          {publicsSpecifiques.map((publicSpecifique) => (
            <li key={publicSpecifique} className='badge tag badge-base-200 badge-soft text-base-title'>
              {publicSpecifique}
            </li>
          ))}
        </ul>
      </>
    ) : (
      <span className='badge tag badge-base-200 badge-soft text-base-title'>
        <RiUserHeartLine size={16} aria-hidden={true} />
        Tout public
      </span>
    )}
    {modalitesAcces.length > 0 && (
      <>
        <h3 className='text-sm font-semibold pt-4 pb-2'>Modalités d’accès au service</h3>
        <ul className='flex flex-wrap gap-2'>
          {modalitesAcces.map((modaliteAcces) => {
            const Icon = modalitesAccesIcons[modaliteAcces];
            return (
              <li key={modaliteAcces} className='badge tag badge-base-200 badge-soft text-base-title'>
                {Icon && <Icon size={16} />}
                {modaliteAcces}
              </li>
            );
          })}
        </ul>
      </>
    )}
    {fraisACharge.length > 0 && (
      <>
        <h3 className='text-sm font-semibold pt-4 pb-2'>Frais à charge</h3>
        <ul className='flex flex-wrap gap-2'>
          {fraisACharge.map((frais) => (
            <li key={frais} className='badge tag badge-base-200 badge-soft text-base-title'>
              {frais}
            </li>
          ))}
        </ul>
      </>
    )}
    {prisesEnChargeSpecifiques.length > 0 && (
      <>
        <h3 className='text-sm font-semibold pt-4 pb-2'>Prise en charge de publics avec des besoins spécifiques</h3>
        <ul className='flex flex-wrap gap-2'>
          {prisesEnChargeSpecifiques.map((priseEnCharge) => (
            <li key={priseEnCharge} className='badge tag badge-base-200 badge-soft text-base-title'>
              {priseEnCharge}
            </li>
          ))}
        </ul>
      </>
    )}
  </>
);
