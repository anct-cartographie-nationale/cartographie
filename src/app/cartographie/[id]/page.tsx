import { pageBuilder } from '@/configuration/nextjs';
import { withLegacyId } from '@/features/cartographie';

export default pageBuilder()
  .use(withLegacyId())
  .redirectTo(({ id }) => `/lieux/${id}`);
