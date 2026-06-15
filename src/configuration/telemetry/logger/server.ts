import { withLogger as createActionLogger } from '@arckit/nextjs/telemetry';
import { getIdentity, getScope, getTrace } from '@arckit/telemetry/context';
import { createPinoLogger } from '@arckit/telemetry/logger';

export const logger = createPinoLogger({ getScope, getIdentity, getTrace });

export const withActionLogger = createActionLogger(logger);
