import { eventTracker } from './event-tracker';

export const TrackerCategory = {
  SEARCH: 'Search',
  NAVIGATION: 'Navigation',
  EXPORT: 'Export',
  MAP: 'Map',
  FILTER: 'Filter',
  LOCATION: 'Location',
  EMBED: 'Embed'
} as const;

export const TrackerAction = {
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
  FILTER_APPLY: 'filter_apply',
  EMBED_MAP_CLICK: 'embed_map_click'
} as const;

export type TrackerCategoryType = (typeof TrackerCategory)[keyof typeof TrackerCategory];
export type TrackerActionType = (typeof TrackerAction)[keyof typeof TrackerAction];

type TrackEvent = {
  category: TrackerCategoryType;
  action: TrackerActionType;
  name?: string;
  value?: number;
};

export const trackEvent = ({ category, action, ...properties }: TrackEvent): void => {
  eventTracker.track({ event: `${category} ${action}`, properties });
};
