'use client';

import { createClientBinder } from '@arckit/nextjs/client/bindings';
import { provideLazy } from '@/libraries/injection';

export const ClientBinder = createClientBinder(provideLazy);
