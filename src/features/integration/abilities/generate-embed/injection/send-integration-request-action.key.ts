import type { ServerActionResult } from '@arckit/nextjs/action';
import { keyFor } from 'piqure';

export const SEND_INTEGRATION_REQUEST_ACTION = keyFor<(input?: unknown) => Promise<ServerActionResult<void>>>(
  'send-integration-request-action'
);
