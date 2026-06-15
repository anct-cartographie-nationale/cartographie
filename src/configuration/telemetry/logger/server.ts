import { createWithLogger } from '@arckit/nextjs/route';
import { withLogger as createActionLogger } from '@arckit/nextjs/telemetry';
import { getIdentity, getScope, getTrace } from '@arckit/telemetry/context';
import { createPinoLogger } from '@arckit/telemetry/logger';

export const logger = createPinoLogger({ getScope, getIdentity, getTrace });

export const withLogger = createWithLogger(logger);

export const withActionLogger = createActionLogger(logger);
