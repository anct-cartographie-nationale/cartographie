import OpeningHours from 'opening_hours';
import type { LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';

export class OpeningHoursCache {
  private readonly raw: Map<string, string>;
  private readonly parsed = new Map<string, OpeningHours>();
  private readonly invalid = new Set<string>();

  constructor(data: LieuxRouteResponse) {
    this.raw = new Map();
    for (const lieu of data) {
      if (lieu.horaires) this.raw.set(lieu.id, lieu.horaires);
    }
  }

  get(id: string): OpeningHours | undefined {
    if (this.parsed.has(id)) return this.parsed.get(id);
    if (this.invalid.has(id)) return undefined;
    const horaires = this.raw.get(id);
    if (!horaires) return undefined;
    try {
      const oh = new OpeningHours(horaires);
      this.parsed.set(id, oh);
      return oh;
    } catch {
      this.invalid.add(id);
      return undefined;
    }
  }
}
