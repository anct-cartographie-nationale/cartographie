import { createPageBuilder, createWithClientBinder } from '@arckit/nextjs/page';
import { ClientBinder } from './client';

export { withUrlSearchParams } from './with-url-search-params';

export const withClientBinder = createWithClientBinder(ClientBinder);

export const pageBuilder = createPageBuilder(withClientBinder);
