import { notFound } from 'next/navigation';
import { createRequiredMiddleware } from '../../shared/middlewares/create-required-middleware';

export const withRequired = createRequiredMiddleware(() => notFound());
