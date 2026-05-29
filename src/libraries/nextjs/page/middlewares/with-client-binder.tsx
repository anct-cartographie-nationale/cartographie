import { createWithClientBinder } from '@arckit/nextjs/page';
import { ClientBinder } from './client-binder';

export const withClientBinder = createWithClientBinder(ClientBinder);
