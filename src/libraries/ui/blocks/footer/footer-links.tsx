import { Link, type LinkProps } from '@/libraries/ui/primitives/link';

export type FooterLink = {
  key: string;
  linkProps: LinkProps;
};

export const FooterLinks = ({ links }: { links: FooterLink[] }) =>
  links.map(({ key, linkProps }) => <Link key={key} kind='link-hover' {...linkProps} />);
