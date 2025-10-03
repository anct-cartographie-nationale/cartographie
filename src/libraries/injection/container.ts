import { piqure } from 'piqure';

const memory = new Map();

const { inject, provide } = piqure(memory);

export { inject, provide };
