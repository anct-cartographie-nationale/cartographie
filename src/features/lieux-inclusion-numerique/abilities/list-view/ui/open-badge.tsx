'use client';

import { Badge } from '@arckit/daisyui/primitives';
import OpeningHours from 'opening_hours';

export const OpenBadge = ({ horaires }: { horaires: string }) => {
  try {
    const isOpen = new OpeningHours(horaires).getState(new Date());
    return isOpen ? (
      <Badge color='badge-success' scale='badge-sm' className='font-bold uppercase'>
        Ouvert
      </Badge>
    ) : null;
  } catch {
    return null;
  }
};
