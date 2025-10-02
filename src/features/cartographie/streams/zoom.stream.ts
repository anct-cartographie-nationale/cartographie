import { Subject } from 'rxjs';

const zoomSubject$ = new Subject<number>();

export const zoom$ = zoomSubject$.asObservable();

export const setZoom = (zoom: number) => zoomSubject$.next(zoom);
