import type { ErrorReporter } from '@arckit/telemetry/error-reporter';
import { key } from 'piqure';

export const ERROR_REPORTER = key<ErrorReporter>('error-reporter');
