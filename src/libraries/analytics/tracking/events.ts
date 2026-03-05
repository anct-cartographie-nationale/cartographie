export const MatomoCategory = {
  SEARCH: 'Search',
  NAVIGATION: 'Navigation',
  EXPORT: 'Export',
  MAP: 'Map',
  FILTER: 'Filter',
  LOCATION: 'Location'
} as const;

export const MatomoAction = {
  // Search (KPI prioritaire)
  SEARCH_QUERY: 'search_query',
  SEARCH_SELECT: 'search_select',

  // Navigation (KPI prioritaire)
  REGION_SELECT: 'region_select',
  DEPARTMENT_SELECT: 'department_select',
  CLUSTER_EXPAND: 'cluster_expand',

  // Export (KPI prioritaire)
  EXPORT_START: 'export_start',
  EXPORT_COMPLETE: 'export_complete',

  // Map
  ZOOM_CHANGE: 'zoom_change',
  LAYER_TOGGLE: 'layer_toggle',
  FULLSCREEN_TOGGLE: 'fullscreen_toggle',

  // Filter
  FILTER_APPLY: 'filter_apply'
} as const;

export type MatomoCategoryType = (typeof MatomoCategory)[keyof typeof MatomoCategory];
export type MatomoActionType = (typeof MatomoAction)[keyof typeof MatomoAction];
