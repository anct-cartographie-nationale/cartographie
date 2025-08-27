import { Link } from '@/libraries/ui/primitives/link';
import { cn } from '@/libraries/utils';

type BreadcrumbsProps = {
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
};

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) =>
  items.length > 0 && (
    <div className={cn('flex breadcrumbs text-xs', className)}>
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
