'use client';

import { OvoidBackground } from '@/libraries/ui/backgrounds/ovoid.background';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { TechnicalErrorIllustration } from '@/libraries/ui/pictograms/system/technical-error.illustration';
import { Button } from '@/libraries/ui/primitives/button';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';

const ErrorPage = ({ reset }: { error: globalThis.Error & { digest?: string }; reset: () => void }) => (
  <main id={contentId} className='overflow-scroll flex h-dvh'>
    <div className='container m-auto'>
      <div className='grid grid-cols-1 md:grid-cols-5 xl:gap-42 gap-21 mt-12 mb-48 items-center 2xl:mx-68 xl:mx-36 lg:mx-24 md:mx-20 mx-4'>
        <div className='md:col-span-3'>
          <h1 className='mb-6 text-4xl text-base-title font-bold'>Service temporairement indisponible</h1>
          <p className='text-xl mb-6'>
            Les données de la cartographie sont momentanément inaccessibles. Cela peut être dû à une maintenance ou à une
            surcharge du service.
          </p>
          <p className='text-sm mb-10'>
            Nous vous invitons à réessayer dans quelques instants. Si le problème persiste, vous pouvez revenir à la page
            d&apos;accueil.
          </p>
          <div className='flex flex-col md:flex-row gap-4'>
            <Button onClick={reset} color='btn-primary' className='btn-block md:w-auto'>
              Réessayer
            </Button>
            <ButtonLink href='/' kind='btn-outline' className='btn-block md:w-auto'>
              Page d&apos;accueil
            </ButtonLink>
          </div>
        </div>
        <div className='md:col-span-2 relative'>
          <TechnicalErrorIllustration
            className='absolute z-1 translate-x-1/2 translate-y-1/2 md:translate-y-3/4'
            width='50%'
            height='auto'
          />
          <OvoidBackground className='relative md:px-0 px-12' width='100%' height='auto' />
        </div>
      </div>
    </div>
  </main>
);

export default ErrorPage;
