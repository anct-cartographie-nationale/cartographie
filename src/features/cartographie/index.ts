export { Geolocate } from './abilities/controls';
export {
  Cartographie,
  DepartementsOnMap,
  DepartementsPage,
  FragiliteNumeriqueLayers,
  RegionsOnMap,
  RegionsPage
} from './abilities/map-view';
export { addressCombobox, addressOptions, SearchAddress } from './abilities/search';
export { withLegacyDepartement, withLegacyDepartementOnly } from './middlewares/page/with-legacy-departement';
export { withLegacyId } from './middlewares/page/with-legacy-id';
export { withLegacyRegion } from './middlewares/page/with-legacy-region';
