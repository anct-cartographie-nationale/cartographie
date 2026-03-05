import { useIsFetching } from '@tanstack/react-query';
import { useEffect } from 'react';
import { endLoad, startLoad } from '@/libraries/map';

export const LoadStreamSync = () => {
  const isFetching = useIsFetching();

  useEffect(() => {
    isFetching > 0 ? startLoad() : endLoad();
  }, [isFetching]);

  return null;
};
