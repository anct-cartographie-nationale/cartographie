import { withLegacyRegion } from '@/features/cartographie';
import { pageBuilder } from '@/libraries/nextjs/page';

export default pageBuilder()
  .use(withLegacyRegion())
  .redirectTo(({ region }) => `/${region.slug}`);
