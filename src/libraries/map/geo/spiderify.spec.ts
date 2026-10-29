import { describe, expect, it } from 'vitest';
import type { Position2D } from './position-2d';
import { spiderifyOffsets } from './spiderify';

const LANDERNEAU: Position2D = [-4.257626, 48.450798];
const BREST: Position2D = [-4.486076, 48.390394];
const MARKER_SIZE = 36;

const distance = ([x1, y1]: Position2D, [x2, y2]: Position2D): number => Math.hypot(x2 - x1, y2 - y1);

const pointsAt = (position: Position2D, count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: `lieu-${index}`, position }));

describe('spiderify offsets', () => {
  it('should not offset a single point', () => {
    const offsets = spiderifyOffsets([{ id: 'lieu-0', position: LANDERNEAU }]);

    expect(offsets.get('lieu-0')).toEqual([0, 0]);
  });

  it('should not offset points at distinct positions', () => {
    const offsets = spiderifyOffsets([
      { id: 'lieu-0', position: LANDERNEAU },
      { id: 'lieu-1', position: BREST }
    ]);

    expect(offsets.get('lieu-0')).toEqual([0, 0]);
    expect(offsets.get('lieu-1')).toEqual([0, 0]);
  });

  it.each([2, 3, 5, 10, 25])('should spread %i points at the same position without overlapping markers', (count) => {
    const points = pointsAt(LANDERNEAU, count);

    const offsets: Position2D[] = [...spiderifyOffsets(points).values()];

    const distances = offsets.flatMap((offset, index) => offsets.slice(index + 1).map((other) => distance(offset, other)));
    expect(offsets).toHaveLength(count);
    expect(Math.min(...distances)).toBeGreaterThanOrEqual(MARKER_SIZE);
  });

  it('should spread points whose positions only differ by float precision', () => {
    const offsets = spiderifyOffsets([
      { id: 'coop', position: [-4.257626, 48.450798] },
      { id: 'france-travail', position: [-4.257626056671143, 48.45079803466797] }
    ]);

    expect(distance(offsets.get('coop') ?? [0, 0], offsets.get('france-travail') ?? [0, 0])).toBeGreaterThanOrEqual(
      MARKER_SIZE
    );
  });

  it('should keep spread points around their real position', () => {
    const offsets: Position2D[] = [...spiderifyOffsets(pointsAt(LANDERNEAU, 3)).values()];

    const [sumX, sumY] = offsets.reduce<Position2D>(([x, y], [offsetX, offsetY]) => [x + offsetX, y + offsetY], [0, 0]);
    expect(sumX).toBeCloseTo(0);
    expect(sumY).toBeCloseTo(0);
  });

  it('should only offset points sharing a position', () => {
    const offsets = spiderifyOffsets([...pointsAt(LANDERNEAU, 3), { id: 'brest', position: BREST }]);

    expect(offsets.get('brest')).toEqual([0, 0]);
    expect(offsets.get('lieu-0')).not.toEqual([0, 0]);
  });

  it('should give the same offset to a point whatever the input order', () => {
    const points = pointsAt(LANDERNEAU, 4);

    const offsets = spiderifyOffsets(points);
    const reversedOffsets = spiderifyOffsets(points.toReversed());

    expect(reversedOffsets).toEqual(offsets);
  });
});
