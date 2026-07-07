'use client';

import { Button, LoadingButton } from '@arckit/daisyui/primitives';
import { Modal, ModalActions, ModalBox, ModalCloseButton } from '@arckit/daisyui/primitives-client';
import { handleAction, handleSubmit, useAppForm } from '@arckit/form';
import { toastError } from '@arckit/nextjs/client';
import toast from 'react-hot-toast';
import { useServerAction } from '@/configuration/nextjs/client';
import { inject } from '@/libraries/injection';
import { Link } from '@/libraries/ui/primitives/link';
import { contactFormSchema } from '../domain/contact-form.schema';
import { SEND_CONTACT_MESSAGE_ACTION } from '../injection/send-contact-message-action.key';

const STATUT_OPTIONS = [
  { label: "Structure d'inclusion numérique", value: "Structure d'inclusion numérique" },
  { label: 'Médiateur numérique', value: 'Médiateur numérique' },
  { label: 'Conseiller numérique', value: 'Conseiller numérique' },
  { label: 'Coordinateur Conseiller numérique', value: 'Coordinateur Conseiller numérique' },
  { label: 'Usager', value: 'Usager' },
  { label: 'Autre', value: 'Autre' }
];

const TYPE_DEMANDE_OPTIONS = [
  { label: 'Demander de mettre à jour une page', value: 'Demander de mettre à jour une page' },
  { label: 'Demander de supprimer une information', value: 'Demander de supprimer une information' },
  { label: 'Renseignements sur un lieu', value: 'Renseignements sur un lieu' },
  { label: 'Bug', value: 'Bug' }
];

const ErrorIcon = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, the message conveys the information
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M17.5,2.5h-11L1,12l5.5,9.5h11L23,12L17.5,2.5z M16.2,14.8l-1.4,1.4L12,13.4l-2.8,2.8l-1.4-1.4l2.8-2.8L7.8,9.2l1.4-1.4l2.8,2.8l2.8-2.8l1.4,1.4L13.4,12L16.2,14.8z' />
  </svg>
);

type ContactFormModalProps = {
  open: boolean;
  onClose: () => void;
  pageUrl?: string | undefined;
};

const ERROR_MESSAGES: Record<string, string> = {
  'internal-error': "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer."
};

const contactErrorMessage = (code: string): string => ERROR_MESSAGES[code] ?? 'Une erreur est survenue. Veuillez réessayer.';

export const ContactFormModal = ({ open, onClose, pageUrl }: ContactFormModalProps) => {
  const [sendContactMessage, isPending] = useServerAction(inject(SEND_CONTACT_MESSAGE_ACTION), {
    onSuccess: () => {
      toast.success('Votre message a bien été envoyé.');
      form.reset();
      onClose();
    },
    onError: toastError(contactErrorMessage)
  });

  const form = useAppForm({
    defaultValues: {
      prenom: '',
      nom: '',
      email: '',
      statut: '',
      pageUrl: pageUrl ?? '',
      typeDemande: '',
      description: ''
    },
    validators: {
      onSubmit: contactFormSchema
    },
    onSubmit: handleAction(sendContactMessage)
  });

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleCancel} responsive>
      <ModalBox size='max-w-2xl' fullWidth>
        <ModalCloseButton />
        <h2 className='text-2xl font-bold mb-2'>Vous avez une question ou besoin d'aide ?</h2>
        <p className='text-sm mb-2'>
          Nous lisons tous les messages et nous nous engageons à vous répondre dans un délai maximum de 72 heures.
        </p>
        <p className='text-sm mb-2'>
          Avant de nous écrire, vous trouverez peut-être votre réponse dans{' '}
          <Link
            href='https://docs.numerique.gouv.fr/docs/a3fc0175-e136-4e23-8ef7-2fa9b5ef165e/'
            target='_blank'
            color='link-primary'
          >
            notre documentation
          </Link>
          .
        </p>
        <p className='text-sm mb-4'>
          Si vous souhaitez mettre à jour les informations de votre structure sur la COOP de la médiation numérique, une{' '}
          <Link href='https://www.loom.com/share/93ff67bcc11f4ae981921be6fe865df9' target='_blank' color='link-primary'>
            vidéo explicative
          </Link>{' '}
          est disponible.
        </p>
        <form onSubmit={handleSubmit(form)} className='flex flex-col gap-4'>
          <p className='text-xs text-neutral'>
            <span className='text-error-content'>*</span> Champs obligatoires
          </p>
          <form.AppField name='prenom'>
            {(field) => (
              <div>
                <field.Label required>Prénom</field.Label>
                <field.Input isPending={isPending} className='w-full' />
                <field.Error icon={<ErrorIcon />} className='text-error-content text-xs mt-3' />
              </div>
            )}
          </form.AppField>
          <form.AppField name='nom'>
            {(field) => (
              <div>
                <field.Label required>Nom</field.Label>
                <field.Input isPending={isPending} className='w-full' />
                <field.Error icon={<ErrorIcon />} className='text-error-content text-xs mt-3' />
              </div>
            )}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => (
              <div>
                <field.Label required>Adresse e-mail</field.Label>
                <field.Input isPending={isPending} type='email' placeholder='votre@email.fr' className='w-full' />
                <field.Error icon={<ErrorIcon />} className='text-error-content text-xs mt-3' />
              </div>
            )}
          </form.AppField>
          <form.AppField name='statut'>
            {(field) => (
              <div>
                <field.Label required>Statut</field.Label>
                <field.Select isPending={isPending} className='w-full'>
                  <option value='' disabled>
                    Sélectionnez votre statut
                  </option>
                  {STATUT_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </field.Select>
                <field.Error icon={<ErrorIcon />} className='text-error-content text-xs mt-3' />
              </div>
            )}
          </form.AppField>
          <form.AppField name='typeDemande'>
            {(field) => (
              <div>
                <field.Label required>Type de demande</field.Label>
                <field.Select isPending={isPending} className='w-full'>
                  <option value='' disabled>
                    Sélectionnez le type de demande
                  </option>
                  {TYPE_DEMANDE_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </field.Select>
                <field.Error icon={<ErrorIcon />} className='text-error-content text-xs mt-3' />
              </div>
            )}
          </form.AppField>
          <form.AppField name='pageUrl'>
            {(field) => (
              <div>
                <field.Label>URL de la page concernée</field.Label>
                <field.Input isPending={isPending} placeholder='https://...' className='w-full' />
                <field.Error icon={<ErrorIcon />} className='text-error-content text-xs mt-3' />
              </div>
            )}
          </form.AppField>
          <form.AppField name='description'>
            {(field) => (
              <div>
                <field.Label>Description</field.Label>
                <field.Textarea
                  isPending={isPending}
                  rows={5}
                  placeholder='Décrivez votre demande en précisant les éléments concernés (titre, horaires, services, aidant rattaché...)'
                  className='w-full'
                />
              </div>
            )}
          </form.AppField>
          <ModalActions>
            <Button type='button' color='btn-primary' kind='btn-outline' onClick={handleCancel}>
              Annuler
            </Button>
            <LoadingButton type='submit' color='btn-primary' isLoading={isPending}>
              Envoyer
            </LoadingButton>
          </ModalActions>
        </form>
      </ModalBox>
    </Modal>
  );
};
