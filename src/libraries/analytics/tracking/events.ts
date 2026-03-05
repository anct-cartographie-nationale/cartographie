export const MatomoCategory = {
  SEARCH: 'Search',
  NAVIGATION: 'Navigation',
  EXPORT: 'Export',
  MAP: 'Map',
  FILTER: 'Filter',
  LOCATION: 'Location'
} as const;

export const MatomoAction = {
  SEARCH_QUERY: 'search_query',
  SEARCH_SELECT: 'search_select',
  REGION_SELECT: 'region_select',
  DEPARTMENT_SELECT: 'department_select',
  CLUSTER_EXPAND: 'cluster_expand',
  EXPORT_START: 'export_start',
  EXPORT_COMPLETE: 'export_complete',
  ZOOM_CHANGE: 'zoom_change',
  LAYER_TOGGLE: 'layer_toggle',
  FULLSCREEN_TOGGLE: 'fullscreen_toggle',
  FILTER_APPLY: 'filter_apply'
} as const;

export type MatomoCategoryType = (typeof MatomoCategory)[keyof typeof MatomoCategory];
export type MatomoActionType = (typeof MatomoAction)[keyof typeof MatomoAction];
