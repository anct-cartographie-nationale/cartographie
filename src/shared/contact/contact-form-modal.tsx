'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { Label, useAppForm } from '@/libraries/form';
import { Button } from '@/libraries/ui/primitives/button';
import { Link } from '@/libraries/ui/primitives/link';
import { LoadingButton } from '@/libraries/ui/primitives/loading-button';
import { Modal, ModalActions, ModalBox, ModalCloseButton } from '@/libraries/ui/primitives/modal';
import { contactFormSchema } from './contact-form.schema';
import { sendContactMessage } from './send-contact-message.action';

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
  pageUrl?: string;
};

export const ContactFormModal = ({ open, onClose, pageUrl }: ContactFormModalProps) => {
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
        <h2 className='text-2xl font-bold mb-2'>Contactez-nous</h2>
        <p className='text-sm mb-4'>
          Si vous êtes médiateur ou médiatrice numérique, conseiller ou conseillère numérique, vous pouvez mettre à jour les
          informations directement depuis{' '}
          <Link href='https://coop-numerique.anct.gouv.fr/' target='_blank' color='link-primary'>
            la Coop' de la Médiation Numérique
          </Link>
          .{' '}
          <Link
            href='https://docs.numerique.gouv.fr/docs/5e76c8e6-7edd-4062-9294-b3a65e35b571/'
            target='_blank'
            color='link-primary'
          >
            Voir le tutoriel vidéo
          </Link>
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className='flex flex-col gap-4'
        >
          <form.AppField name='prenom'>
            {(field) => (
              <field.FieldGroup>
                <Label>Prénom</Label>
                <field.InputField isPending={isPending} className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='nom'>
            {(field) => (
              <field.FieldGroup>
                <Label>Nom</Label>
                <field.InputField isPending={isPending} className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => (
              <field.FieldGroup>
                <Label>Adresse e-mail</Label>
                <field.InputField isPending={isPending} type='email' placeholder='votre@email.fr' className='w-full' />
                <field.ErrorMessage />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='statut'>
            {(field) => (
              <field.FieldGroup>
                <Label>Statut</Label>
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
          <form.AppField name='pageUrl'>
            {(field) => (
              <field.FieldGroup>
                <Label>URL de la page concernée</Label>
                <field.InputField isPending={isPending} placeholder='https://...' className='w-full' />
              </field.FieldGroup>
            )}
          </form.AppField>
          <form.AppField name='typeDemande'>
            {(field) => (
              <field.FieldGroup>
                <Label>Type de demande</Label>
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
