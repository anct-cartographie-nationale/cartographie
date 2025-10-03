import type { Position2D } from '../../geo';
import type { Lieu } from './lieu';

export type LieuxForChunk = ([longitude, latitude]: Position2D) => Promise<Lieu[]>;
