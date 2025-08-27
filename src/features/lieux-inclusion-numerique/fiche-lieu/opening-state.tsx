import { RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri';
import { Badge } from '@/libraries/ui/primitives/badge';
import { openingState } from './opening-hours.presenter';

const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

type OpeningStateProps = {
  osmOpeningHours?: string;
};

export const OpeningState = ({ osmOpeningHours }: OpeningStateProps) => {
  const state = openingState(new Date())(osmOpeningHours);

  return (
    state && (
      <div className='flex gap-2'>
        {state.isOpen ? (
          <>
            <Badge color='badge-success' className='font-bold uppercase gap-1'>
              <RiCheckboxCircleFill size={16} aria-hidden={true} />
              Ouvert
            </Badge>
            {state.time && (
              <span className='font-semibold'>
                Ferme à {state.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </>
        ) : (
          <>
            <Badge color='badge-error' className='font-bold uppercase gap-1'>
              <RiCloseCircleFill size={16} aria-hidden={true} />
              Fermé
            </Badge>
            {state.time && (
              <span className='font-semibold'>
                Ouvre {days[state.day]} à {state.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </>
        )}
      </div>
    )
  );
};
