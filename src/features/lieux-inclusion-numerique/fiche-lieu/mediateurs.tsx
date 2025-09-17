import { RiCheckLine, RiMailLine, RiPhoneLine } from 'react-icons/ri';

type MediateursProps = {
  mediateurs: {
    nom: string;
    labels?: string[];
    email?: string;
    telephone?: string;
  }[];
};

export const Mediateurs = ({ mediateurs }: MediateursProps) => (
  <>
    <h2 className='text-xl text-base-title font-bold mb-4'>{mediateurs.length} accompagnants numériques dans ce lieu</h2>
    <ul className='list'>
      {mediateurs.map((mediateur) => (
        <li key={mediateur.nom} className='list-row flex flex-col gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-lg text-base-title font-bold'>{mediateur.nom}</span>
            {mediateur.labels?.map((label) => (
              <span key={label} className='badge tag tag-sm badge-base-200 text-base-title badge-soft'>
                <RiCheckLine size={16} aria-hidden={true} />
                {label}
              </span>
            ))}
          </div>
          {(mediateur.email || mediateur.telephone) && (
            <div className='flex items-center gap-2'>
              {mediateur.email && (
                <>
                  <span className='flex items-center gap-2'>
                    <RiMailLine aria-hidden={true} />
                    {mediateur.email}
                  </span>
                  {mediateur.telephone && '·'}
                </>
              )}
              {mediateur.telephone && (
                <span className='flex items-center gap-2'>
                  <RiPhoneLine aria-hidden={true} />
                  {mediateur.telephone}
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  </>
);
