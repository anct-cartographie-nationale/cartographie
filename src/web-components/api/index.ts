export { API_BASE_URL } from './api-base-url.key';
export type { DepartementLieuxResponse, DepartementWithCount, LieuxResponse, RegionWithCount } from './stats';
export {
  fetchAllLieux,
  fetchDepartementLieux,
  fetchDepartementsStats,
  fetchRegionLieux,
  fetchRegionsStats,
  fetchRegionTotalLieux,
  fetchTotalLieux
} from './stats';
