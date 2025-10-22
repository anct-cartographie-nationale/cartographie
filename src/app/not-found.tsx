import { OvoidBackground } from '@/libraries/ui/backgrounds/ovoid.background';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { TechnicalErrorIllustration } from '@/libraries/ui/pictograms/system/technical-error.illustration';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';

const NotFound = async () => (
  <main id={contentId} className='overflow-scroll flex h-full'>
    <div className='container m-auto'>
      <div className='grid grid-cols-1 md:grid-cols-5 xl:gap-42 gap-21 mt-12 mb-48 items-center 2xl:mx-68 xl:mx-36 lg:mx-24 md:mx-20 mx-4'>
        <div className='md:col-span-3'>
          <h1 className='mb-6 text-4xl text-base-title font-bold'>Page non trouvée</h1>
          <p className='text-sm mb-6'>Erreur 404</p>
          <p className='text-xl mb-6'>La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée.</p>
          <p className='text-sm mb-10'>
            Si vous avez tapé l&apos;adresse web dans le navigateur, vérifiez qu&apos;elle est correcte. La page n’est peut-être
            plus disponible.
            <br />
            Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil.
          </p>
          <ul className='fr-btns-group fr-btns-group--inline-md'>
            <li>
              <ButtonLink href='/' color='btn-primary' className='btn-block md:w-auto'>
                Page d&apos;accueil
              </ButtonLink>
            </li>
          </ul>
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

export default NotFound;
