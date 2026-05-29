'use client';

import { Button, LoadingButton } from '@arckit/daisyui/primitives';
import { Modal, ModalActions, ModalBox, ModalCloseButton } from '@arckit/daisyui/primitives-client';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { Label, useAppForm } from '@/libraries/form';
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

type ContactFormModalProps = {
  open: boolean;
  onClose: () => void;
  pageUrl?: string | undefined;
};

export const ContactFormModal = ({ open, onClose, pageUrl }: ContactFormModalProps) => {
  const sendContactMessage = inject(SEND_CONTACT_MESSAGE_ACTION);
  const [isPending, startTransition] = useTransition();

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
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await sendContactMessage(value);
        if (result.success) {
          toast.success('Votre message a bien été envoyé.');
          form.reset();
          onClose();
        } else {
          toast.error(result.error);
        }
      });
    }
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className='flex flex-col gap-4'
        >
          <p className='text-xs text-neutral'>
            <span className='text-error-content'>*</span> Champs obligatoires
          </p>
          <form.AppField name='prenom'>
            {(field) => (
              <field.FieldGroup>
                <Label required>Prénom</Label>
                <field.InputField isPending={isPending} className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='nom'>
            {(field) => (
              <field.FieldGroup>
                <Label required>Nom</Label>
                <field.InputField isPending={isPending} className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => (
              <field.FieldGroup>
                <Label required>Adresse e-mail</Label>
                <field.InputField isPending={isPending} type='email' placeholder='votre@email.fr' className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='statut'>
            {(field) => (
              <field.FieldGroup>
                <Label required>Statut</Label>
                <field.SelectField
                  isPending={isPending}
                  options={STATUT_OPTIONS}
                  placeholder='Sélectionnez votre statut'
                  className='w-full'
                />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='typeDemande'>
            {(field) => (
              <field.FieldGroup>
                <Label required>Type de demande</Label>
                <field.SelectField
                  isPending={isPending}
                  options={TYPE_DEMANDE_OPTIONS}
                  placeholder='Sélectionnez le type de demande'
                  className='w-full'
                />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='pageUrl'>
            {(field) => (
              <field.FieldGroup>
                <Label>URL de la page concernée</Label>
                <field.InputField isPending={isPending} placeholder='https://...' className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='description'>
            {(field) => (
              <field.FieldGroup>
                <Label>Description</Label>
                <field.TextareaField
                  isPending={isPending}
                  rows={5}
                  placeholder='Décrivez votre demande en précisant les éléments concernés (titre, horaires, services, aidant rattaché...)'
                  className='w-full'
                />
              </field.FieldGroup>
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
