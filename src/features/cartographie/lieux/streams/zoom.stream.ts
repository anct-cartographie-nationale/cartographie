import { BehaviorSubject } from 'rxjs';

const zoomSubject$ = new BehaviorSubject<number>(0);

export const zoom$ = zoomSubject$.asObservable();

export const setZoom = (zoom: number) => zoomSubject$.next(zoom);
