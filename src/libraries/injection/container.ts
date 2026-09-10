import { piqure } from 'piqure';

const memory = new Map();

const { inject, provide, provideLazy } = piqure(memory);

export { inject, provide, provideLazy };
