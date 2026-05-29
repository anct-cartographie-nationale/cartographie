import { createPageBuilder, createWithClientBinder } from '@arckit/nextjs/page';
import { ClientBinder } from './client';

export const withClientBinder = createWithClientBinder(ClientBinder);

export const pageBuilder = createPageBuilder(withClientBinder);
