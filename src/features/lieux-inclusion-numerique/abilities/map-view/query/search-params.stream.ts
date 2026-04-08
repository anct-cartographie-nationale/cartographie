'use client';

import { BehaviorSubject } from 'rxjs';

const searchParamsSubject = new BehaviorSubject<URLSearchParams>(new URLSearchParams());

export const searchParams$ = searchParamsSubject.asObservable();

export const setSearchParams = (searchParams: URLSearchParams): void => {
  searchParamsSubject.next(searchParams);
};
