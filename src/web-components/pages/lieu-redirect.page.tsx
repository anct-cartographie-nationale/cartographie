import { skipToken, useQuery } from '@tanstack/react-query';
import { Navigate, useParams, useSearch } from '@tanstack/react-router';
import type { FC } from 'react';
import { hrefWithSearchParams } from '@/libraries/next';
import { fetchLieu } from '../api';

export const Page: FC = () => {
  const { id } = useParams({ from: '/lieux/$id' });
  const search: Record<string, string> = useSearch({ from: '/lieux/$id' });

  const searchParams = new URLSearchParams(search);

  const {
    data: lieu,
    isLoading,
    error
  } = useQuery({
    queryKey: ['lieu', id],
    queryFn: id ? () => fetchLieu(id) : skipToken
  });

  if (isLoading) {
    return <div className='flex items-center justify-center h-full'>Chargement...</div>;
  }

  if (error || !lieu) {
    return <div className='flex items-center justify-center h-full'>Lieu non trouvé</div>;
  }

  if (!lieu.region || !lieu.departement) {
    return <div className='flex items-center justify-center h-full'>Lieu non trouvé</div>;
  }

  const redirectPath = hrefWithSearchParams(`/${lieu.region}/${lieu.departement}/lieux/${id}`)(searchParams, ['page']);

  return <Navigate to={redirectPath} replace />;
};
