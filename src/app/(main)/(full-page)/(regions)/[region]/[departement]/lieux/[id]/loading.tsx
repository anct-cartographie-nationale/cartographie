import { RiArrowGoBackLine } from 'react-icons/ri';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { Button } from '@/libraries/ui/primitives/button';
import { Card } from '@/libraries/ui/primitives/card';
import { Skeleton } from '@/libraries/ui/primitives/skeleton';

export default function Loading() {
  return (
    <div className='overflow-scroll'>
      <Breadcrumbs
        items={[{ label: 'France', href: '/' }, { label: 'Chargement...' }]}
        className='px-8 py-4 border-b border-base-200'
      />
      <main id={contentId} className='container mx-auto px-4 lg:flex gap-16'>
        <article className='flex-1/2 lg:flex-2/3 2xl:flex-3/4 mb-12'>
          <Button kind='btn-link' className='no-underline my-4 px-2' disabled>
            <RiArrowGoBackLine size={16} aria-hidden={true} />
            Retour à la liste
          </Button>

          <div className='flex items-start gap-4'>
            <div className='flex-1'>
              <Skeleton className='h-8 w-3/4 mb-2' />
              <Skeleton className='h-5 w-1/2' />
            </div>
            <Skeleton className='h-12 w-12 rounded' />
          </div>

          <div className='flex gap-2 mt-4'>
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-6 w-28' />
          </div>

          <hr className='border-base-200 mt-4 mb-6' />

          <section>
            <Skeleton className='h-6 w-48 mb-4' />
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-8 w-32' />
              <Skeleton className='h-8 w-40' />
              <Skeleton className='h-8 w-28' />
            </div>
          </section>

          <hr className='border-base-200 my-6' />

          <section>
            <Skeleton className='h-6 w-56 mb-4' />
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-8 w-24' />
              <Skeleton className='h-8 w-36' />
            </div>
          </section>

          <hr className='border-base-200 my-6' />

          <Button kind='btn-outline' color='btn-primary' disabled>
            <span className='loading loading-spinner loading-sm' />
            Chargement du lieu...
          </Button>
        </article>

        <aside className='flex-1/2 lg:flex-1/3 2xl:flex-1/4 mb-12 sticky top-0 self-start'>
          <div className='text-right'>
            <Button kind='btn-link' className='no-underline p-0 my-4' disabled>
              Copier le lien de la page
            </Button>
          </div>
          <Card kind='card-border' className='bg-base-200/50'>
            <div className='card-body'>
              <Skeleton className='h-6 w-32 mb-4' />
              <Skeleton className='h-4 w-full mb-2' />
              <Skeleton className='h-4 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2 mb-4' />
              <Skeleton className='h-10 w-full' />
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
