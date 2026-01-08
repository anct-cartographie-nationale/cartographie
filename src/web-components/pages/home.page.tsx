import type { FC } from 'react';
import { RegionsPage } from '@/features/cartographie/regions.page';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { WithMapLayout } from '../layouts/with-map.layout';

const HARDCODED_TOTAL_LIEUX = 18742;

export const HomePage: FC = () => {
  return (
    <WithMapLayout>
      <RegionsPage totalLieux={HARDCODED_TOTAL_LIEUX} regions={regions as Region[]} />
    </WithMapLayout>
  );
};
