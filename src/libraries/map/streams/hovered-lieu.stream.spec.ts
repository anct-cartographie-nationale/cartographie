import { afterEach, describe, expect, it } from 'vitest';
import { hoverLieu, isLieuHovered$, leaveLieu } from './hovered-lieu.stream';

const collect = (id: string) => {
  const values: boolean[] = [];
  const subscription = isLieuHovered$(id).subscribe((value) => values.push(value));
  return { values, stop: () => subscription.unsubscribe() };
};

describe('hovered lieu stream', () => {
  afterEach(() => {
    leaveLieu('a');
    leaveLieu('b');
  });

  it('tells a lieu when it is hovered then left', () => {
    const { values, stop } = collect('a');

    hoverLieu('a');
    leaveLieu('a');
    stop();

    expect(values).toEqual([false, true, false]);
  });

  it('does not notify a lieu when another one is hovered', () => {
    const { values, stop } = collect('a');

    hoverLieu('b');
    leaveLieu('b');
    stop();

    expect(values).toEqual([false]);
  });

  it('keeps the new lieu hovered when the previous one is left afterwards', () => {
    const { values, stop } = collect('b');

    hoverLieu('a');
    hoverLieu('b');
    leaveLieu('a');
    stop();

    expect(values).toEqual([false, true]);
  });
});
