import { BehaviorSubject } from 'rxjs';

const loadSubject$ = new BehaviorSubject<boolean>(false);

export const load$ = loadSubject$.asObservable();

export const startLoad = () => loadSubject$.next(true);

export const endLoad = () => loadSubject$.next(false);
