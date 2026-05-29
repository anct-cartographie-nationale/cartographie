import type { ServerActionResult } from '@arckit/nextjs/action';
import { keyFor } from 'piqure';

export const SEND_CONTACT_MESSAGE_ACTION =
  keyFor<(input?: unknown) => Promise<ServerActionResult<void>>>('send-contact-message-action');
