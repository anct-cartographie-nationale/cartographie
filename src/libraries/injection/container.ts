import { piqure } from 'piqure';
import type { InjectionKey } from 'piqure/src/Providing';

const memory = new Map();

const { inject, provide, provideLazy } = piqure(memory);

export { inject, provide, provideLazy };

export const key = <T>(description: string): InjectionKey<T> => Symbol.for(description) as InjectionKey<T>;
