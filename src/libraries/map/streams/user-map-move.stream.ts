import { BehaviorSubject, debounceTime, filter, map, Subject, tap } from 'rxjs';

export type MapCentre = { lat: number; lng: number };

type UserMapMove = MapCentre & { zoom: number };

const LIEUX_MIN_ZOOM = 9;
const SETTLE_DELAY_MS = 400;
const COORDINATE_PRECISION = 1000;

const roundCoordinate = (coordinate: number): number => Math.round(coordinate * COORDINATE_PRECISION) / COORDINATE_PRECISION;

export const isSameCentre = (a: MapCentre | undefined, b: MapCentre | undefined): boolean =>
  a?.lat === b?.lat && a?.lng === b?.lng;

const userMapMoveSubject$ = new Subject<UserMapMove>();
const lastUserMapCentreSubject$ = new BehaviorSubject<MapCentre | undefined>(undefined);

export const setUserMapMove = (move: UserMapMove) => userMapMoveSubject$.next(move);

export const forgetUserMapCentre = () => lastUserMapCentreSubject$.next(undefined);

export const lastUserMapCentre$ = lastUserMapCentreSubject$.asObservable();

export const isLastUserMapCentre = (centre: MapCentre): boolean => isSameCentre(lastUserMapCentreSubject$.value, centre);

export const userMapCentre$ = userMapMoveSubject$.pipe(
  filter(({ zoom }) => zoom > LIEUX_MIN_ZOOM),
  debounceTime(SETTLE_DELAY_MS),
  map(({ lat, lng }): MapCentre => ({ lat: roundCoordinate(lat), lng: roundCoordinate(lng) })),
  filter((centre) => !isSameCentre(centre, lastUserMapCentreSubject$.value)),
  tap((centre) => lastUserMapCentreSubject$.next(centre))
);
