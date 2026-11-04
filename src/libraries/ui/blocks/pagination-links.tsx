import {
  NextPageLink as ArckitNextPageLink,
  PageLink as ArckitPageLink,
  PreviousPageLink as ArckitPreviousPageLink
} from '@arckit/daisyui/blocks';
import type { ComponentProps } from 'react';
import { renderInternalLink } from '../primitives/internal-link';

export const PreviousPageLink = (props: Omit<ComponentProps<typeof ArckitPreviousPageLink>, 'renderLink'>) => (
  <ArckitPreviousPageLink {...props} renderLink={renderInternalLink} />
);

export const NextPageLink = (props: Omit<ComponentProps<typeof ArckitNextPageLink>, 'renderLink'>) => (
  <ArckitNextPageLink {...props} renderLink={renderInternalLink} />
);

export const PageLink = (props: Omit<ComponentProps<typeof ArckitPageLink>, 'renderLink'>) => (
  <ArckitPageLink {...props} renderLink={renderInternalLink} />
);
