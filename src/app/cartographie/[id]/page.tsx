import { withLegacyId } from '@/features/cartographie';
import { pageBuilder } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withLegacyId())
  .redirectTo(({ id }) => `/lieux/${id}`);
