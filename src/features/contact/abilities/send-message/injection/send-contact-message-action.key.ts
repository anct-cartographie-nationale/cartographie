import { keyFor } from 'piqure';
import type { ServerActionResult } from '@/libraries/nextjs/server-action/server-action-result';

export const SEND_CONTACT_MESSAGE_ACTION =
  keyFor<(input?: unknown) => Promise<ServerActionResult>>('send-contact-message-action');
