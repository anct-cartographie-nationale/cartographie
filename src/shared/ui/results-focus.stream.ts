import { BehaviorSubject } from 'rxjs';

const resultsFocusSubject$ = new BehaviorSubject<string | undefined>(undefined);

export const resultsFocusRequest$ = resultsFocusSubject$.asObservable();

export const requestResultsFocus = (place: string) => resultsFocusSubject$.next(place);

export const clearResultsFocusRequest = () => resultsFocusSubject$.next(undefined);
