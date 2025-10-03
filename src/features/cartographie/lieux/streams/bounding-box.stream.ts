import type { BBox } from 'geojson';
import { BehaviorSubject } from 'rxjs';

const boundingBoxSubject$ = new BehaviorSubject<BBox>([0, 0, 0, 0]);

export const boundingBox$ = boundingBoxSubject$.asObservable();

export const setBoundingBox = (bbox: BBox) => boundingBoxSubject$.next(bbox);
