import { createPageBuilder } from '@arckit/nextjs/page';
import { withClientBinder } from './middlewares/with-client-binder';

export { ClientBinder } from './middlewares/client-binder';
export { withClientBinder } from './middlewares/with-client-binder';
export { withUrlSearchParams } from './middlewares/with-url-search-params';

export const pageBuilder = createPageBuilder(withClientBinder);
