import type { MapLibreEvent } from 'maplibre-gl';
import { BehaviorSubject } from 'rxjs';

const mapSubject$ = new BehaviorSubject<MapLibreEvent['target'] | undefined>(undefined);

export const map$ = mapSubject$.asObservable();

export const setMap = (map: MapLibreEvent['target']) => mapSubject$.next(map);
