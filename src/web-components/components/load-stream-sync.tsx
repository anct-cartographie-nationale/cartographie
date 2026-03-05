import { useIsFetching } from '@tanstack/react-query';
import { useEffect } from 'react';
import { endLoad, startLoad } from '@/features/lieux-inclusion-numerique/load/load.stream';

export const LoadStreamSync = () => {
  const isFetching = useIsFetching();

  useEffect(() => {
    isFetching > 0 ? startLoad() : endLoad();
  }, [isFetching]);

  return null;
};
