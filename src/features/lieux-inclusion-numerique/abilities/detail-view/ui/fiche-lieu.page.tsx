'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import type { ReactNode } from 'react';
import { RiAlertLine, RiArrowGoBackLine, RiLink } from 'react-icons/ri';
import type { LieuDetails } from '@/libraries/inclusion-numerique-api';
import { inject } from '@/libraries/injection';
import { hrefWithSearchParams } from '@/libraries/nextjs';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { ClipboardButton } from '@/libraries/ui/blocks/clipboard-button';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { BackButtonLink } from '@/libraries/ui/primitives/back-button-link';
import { CONTACT_ACTION } from '@/shared/injection/keys/contact-action.key';
import { Accompagnement } from './sections/accompagnement';
import { ContactCard } from './sections/contact-card';
import { Description } from './sections/description';
import { InformationsGenerales } from './sections/informations-generales';
import { Mediateurs } from './sections/mediateurs';
import { Mobilisation } from './sections/mobilisation';

type FicheLieuPageProps = {
  breadcrumbsItems?: { label: string; href?: string }[];
  listHref: string;
  lieu: LieuDetails;
  lieuUrl: string;
};

export const FicheLieuPage = ({ breadcrumbsItems = [], listHref, lieu, lieuUrl }: FicheLieuPageProps): ReactNode => {
  const ContactAction = inject(CONTACT_ACTION);

  return (
    <div className='overflow-scroll'>
      <SkipLinksPortal />
      <Breadcrumbs items={breadcrumbsItems} className='px-8 py-4 border-b border-base-200' />
      <main id={contentId} className='container mx-auto px-4 lg:flex gap-16'>
        <article className='flex-1/2 lg:flex-2/3 2xl:flex-3/4 mb-12'>
          <BackButtonLink kind='btn-link' href={hrefWithSearchParams(listHref)()} className='no-underline my-4 px-2'>
            <RiArrowGoBackLine size={16} aria-hidden={true} />
            Retour à la liste
          </BackButtonLink>
          <InformationsGenerales {...lieu} />
          <hr className='border-base-200 mt-4 mb-6' />
          <section>
            <Accompagnement {...lieu} />
          </section>
          <hr className='border-base-200 my-6' />
          <section>
            <Mobilisation {...lieu} />
          </section>
          <hr className='border-base-200 my-6' />
          {lieu.description && (
            <>
              <section>
                <Description description={lieu.description} />
              </section>
              <hr className='border-base-200 my-6' />
            </>
          )}
          {lieu.mediateurs.length > 0 && (
            <>
              <section>
                <Mediateurs {...lieu} />
              </section>
              <hr className='border-base-200 my-6' />
            </>
          )}
          <ContactAction kind='btn-outline' color='btn-primary' pageUrl={lieuUrl}>
            <RiAlertLine aria-hidden={true} />
            Signaler une erreur sur les informations du lieu
          </ContactAction>
        </article>
        <aside className='flex-1/2 lg:flex-1/3 2xl:flex-1/4 mb-12 sticky top-0 self-start'>
          <div className='text-right'>
            <ClipboardButton
              kind='btn-link'
              className='no-underline p-0 my-4'
              message={{
                success: 'Lien copié dans le presse-papier',
                error: 'Impossible de copier le lien dans le presse-papier'
              }}
            >
              Copier le lien de la page
              <RiLink aria-hidden={true} />
            </ClipboardButton>
          </div>

          <ContactCard {...lieu} />
        </aside>
      </main>
    </div>
  );
};
