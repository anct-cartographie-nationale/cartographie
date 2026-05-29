import { pageBuilder } from '@/configuration/nextjs';
import { withLegacyRegion } from '@/features/cartographie';

export default pageBuilder()
  .use(withLegacyRegion())
  .redirectTo(({ region }) => `/${region.slug}`);
