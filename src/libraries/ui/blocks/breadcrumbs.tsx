import { Link } from '@/libraries/ui/primitives/link';

type BreadcrumbsProps = {
  items: {
    label: string;
    href?: string;
  }[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) =>
  items.length > 0 && (
    <div className='flex breadcrumbs text-xs'>
      <ul>
        {items.map(({ label, href }) =>
          href ? (
            <li key={href}>
              <Link href={href} className='text-muted'>
                {label}
              </Link>
            </li>
          ) : (
            <li key={label} className='text-base-title'>
              {label}
            </li>
          )
        )}
      </ul>
    </div>
  );
