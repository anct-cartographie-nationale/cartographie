'use client';

import { createClientBinder, createUseServerAction } from '@arckit/nextjs/client/bindings';
import { inject, provideLazy } from '@/libraries/injection';

export const ClientBinder = createClientBinder(provideLazy);
export const useServerAction = createUseServerAction(inject);
