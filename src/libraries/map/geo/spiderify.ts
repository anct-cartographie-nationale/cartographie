import type { Position2D } from './position-2d';

export type SpiderifyPoint = { id: string; position: Position2D };

type SpiderifyGroup = { anchor: Position2D; ids: string[] };

const NO_OFFSET: Position2D = [0, 0];

const MIN_RADIUS = 24;

const LEAVES_SEPARATION = 40;

const SAME_POSITION_TOLERANCE = 0.00001;

const isSamePosition =
  ([x1, y1]: Position2D) =>
  ({ anchor: [x2, y2] }: SpiderifyGroup): boolean =>
    Math.abs(x1 - x2) < SAME_POSITION_TOLERANCE && Math.abs(y1 - y2) < SAME_POSITION_TOLERANCE;

const circleRadius = (count: number): number => Math.max(MIN_RADIUS, LEAVES_SEPARATION / (2 * Math.sin(Math.PI / count)));

const circleOffset = (rank: number, count: number): Position2D => {
  const angle = (2 * Math.PI * rank) / count - Math.PI / 2;
  const radius = circleRadius(count);
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
};

const addToGroups = (groups: SpiderifyGroup[], { id, position }: SpiderifyPoint): SpiderifyGroup[] => {
  const group = groups.find(isSamePosition(position));
  return group == null
    ? [...groups, { anchor: position, ids: [id] }]
    : groups.map((other) => (other === group ? { ...group, ids: [...group.ids, id] } : other));
};

const toGroupOffsets = ({ ids }: SpiderifyGroup): [string, Position2D][] =>
  ids.length > 1
    ? ids.toSorted().map((id: string, rank: number): [string, Position2D] => [id, circleOffset(rank, ids.length)])
    : ids.map((id: string): [string, Position2D] => [id, NO_OFFSET]);

export const spiderifyOffsets = (points: SpiderifyPoint[]): Map<string, Position2D> =>
  new Map(points.reduce(addToGroups, []).flatMap(toGroupOffsets));
