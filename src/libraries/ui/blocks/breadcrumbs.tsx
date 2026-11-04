import { Breadcrumbs as ArckitBreadcrumbs, type BreadcrumbsProps } from '@arckit/daisyui/blocks';
import { renderInternalLink } from '../primitives/internal-link';

export const Breadcrumbs = (props: Omit<BreadcrumbsProps, 'renderLink'>) => (
  <ArckitBreadcrumbs {...props} renderLink={renderInternalLink} />
);
