import { pageBuilder } from '@/configuration/nextjs';
import { withLegacyDepartementOnly } from '@/features/cartographie';

export default pageBuilder()
  .use(withLegacyDepartementOnly())
  .redirectTo(({ region, departement }) => `/${region.slug}/${departement.slug}`);
