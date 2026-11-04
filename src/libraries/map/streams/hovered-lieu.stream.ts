import { BehaviorSubject, distinctUntilChanged, map, type Observable } from 'rxjs';

const hoveredLieuSubject$ = new BehaviorSubject<string | undefined>(undefined);

export const hoveredLieu$ = hoveredLieuSubject$.pipe(distinctUntilChanged());

export const hoverLieu = (id: string) => hoveredLieuSubject$.next(id);

export const leaveLieu = (id: string) => {
  if (hoveredLieuSubject$.value === id) hoveredLieuSubject$.next(undefined);
};

export const isLieuHovered$ = (id: string): Observable<boolean> =>
  hoveredLieu$.pipe(
    map((hovered) => hovered === id),
    distinctUntilChanged()
  );
