import { Body, Column, Container, Head, Hr, Html, Img, Preview, Row, Section, Tailwind, Text } from '@react-email/components';
import type { ReactNode } from 'react';

type EmailLayoutProps = {
  preview: string;
  children: ReactNode;
};

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: '#000091',
        secondary: '#e1000f',
        neutral: '#666666',
        'base-200': '#f6f6f6',
        'base-300': '#eee'
      }
    }
  }
};

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className='bg-base-200 p-6 font-[marianne,arial,sans-serif] text-[#161616]'>
        <Preview>{preview}</Preview>
        <Container className='my-8 bg-white rounded-lg' style={{ maxWidth: '600px' }}>
          <Section className='px-10 pt-8 pb-4 '>
            <Row>
              <Column className='w-12'>
                <Img width={40} height={40} src='https://cartographie.societenumerique.gouv.fr/images/app-logo.svg' alt='' />
              </Column>
              <Column>
                <Text className='m-0 text-base font-bold'>Lieux d'inclusion numérique</Text>
                <Text className='m-0 text-xs text-neutral'>Cartographie nationale</Text>
              </Column>
            </Row>
          </Section>
          <Hr className='border-base-300 ' />
          <Section className='px-10 py-4'>{children}</Section>
        </Container>
        <Section style={{ maxWidth: '450px' }}>
          <Text className='text-xs text-neutral m-0 text-center '>
            Ce message a été envoyé depuis le formulaire de contact de la cartographie nationale des lieux d'inclusion
            numérique.
          </Text>
        </Section>
      </Body>
    </Tailwind>
  </Html>
);
