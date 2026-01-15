import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { RegionsPage } from '@/features/cartographie/regions.page';
import type { Region } from '@/features/collectivites-territoriales/region';
import regions from '@/features/collectivites-territoriales/regions.json';
import { fetchTotalLieux } from '../api';
import { WithMapLayout } from '../layouts/with-map.layout';

export const HomePage: FC = () => {
  const { data: totalLieux = 0 } = useQuery({
    queryKey: ['stats', 'total'],
    queryFn: () => fetchTotalLieux()
  });

  return (
    <WithMapLayout>
      <RegionsPage totalLieux={totalLieux} regions={regions as Region[]} />
    </WithMapLayout>
  );
};
