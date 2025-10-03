import type { BBox } from 'geojson';
import { Subject } from 'rxjs';

const boundingBoxSubject$ = new Subject<BBox>();

export const boundingBox$ = boundingBoxSubject$.asObservable();

export const setBoundingBox = (bbox: BBox) => boundingBoxSubject$.next(bbox);
