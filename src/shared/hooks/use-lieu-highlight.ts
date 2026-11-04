'use client';

import { useEffect, useMemo, useRef } from 'react';
import { hoverLieu, isLieuHovered$, leaveLieu } from '@/libraries/map/streams/hovered-lieu.stream';
import { useSubscribe } from '@/libraries/reactivity/Subscribe';

export const useLieuHighlight = (id: string) => {
  const highlighted$ = useMemo(() => isLieuHovered$(id), [id]);
  const [isHighlighted = false] = useSubscribe(highlighted$, false);
  const isSource = useRef(false);

  useEffect(
    () => () => {
      if (isSource.current) leaveLieu(id);
      isSource.current = false;
    },
    [id]
  );

  const handlers = useMemo(() => {
    const enter = () => {
      isSource.current = true;
      hoverLieu(id);
    };
    const leave = () => {
      isSource.current = false;
      leaveLieu(id);
    };
    return { onMouseEnter: enter, onMouseLeave: leave, onFocus: enter, onBlur: leave };
  }, [id]);

  return { isHighlighted, handlers };
};
