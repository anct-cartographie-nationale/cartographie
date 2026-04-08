const toDepartementCode = (codeInsee: string): string =>
  codeInsee.startsWith('97') ? codeInsee.slice(0, 3) : codeInsee.slice(0, 2);

const countOccurrences = (counts: Map<string, number>, code: string): Map<string, number> =>
  counts.set(code, (counts.get(code) ?? 0) + 1);

export const aggregateByDepartement = (codeInsees: string[]): Map<string, number> =>
  codeInsees.map(toDepartementCode).reduce(countOccurrences, new Map());
