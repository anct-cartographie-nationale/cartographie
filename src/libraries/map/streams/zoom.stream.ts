import { BehaviorSubject } from 'rxjs';

const zoomSubject$ = new BehaviorSubject<number>(5.5);

export const zoom$ = zoomSubject$.asObservable();

export const setZoom = (zoom: number) => zoomSubject$.next(Math.round(zoom * 10) / 10);
