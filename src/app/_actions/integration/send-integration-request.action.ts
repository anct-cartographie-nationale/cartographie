'use server';

import { actionBuilder, ServerActionSuccess, withInput } from '@arckit/nextjs/action';
import { withErrorReporter } from '@/configuration/telemetry/error-reporter/server';
import { withActionLogger } from '@/configuration/telemetry/logger/server';
import { sendIntegrationRequest } from '@/features/integration/abilities/generate-embed/implementations/send-integration-request';
import { throttledIntegrationRequest } from '@/features/integration/abilities/generate-embed/implementations/throttled-integration-request';
import { integrationRequestSchema } from '@/features/integration/domain';

const submitIntegrationRequest = throttledIntegrationRequest(sendIntegrationRequest);

export const sendIntegrationRequestAction = actionBuilder()
  .use(withInput((raw) => integrationRequestSchema.parse(raw)))
  .use(withActionLogger('action:integration:send'))
  .use(withErrorReporter('sendIntegrationRequestAction'))
  .execute<void>(async ({ input }) => {
    await submitIntegrationRequest(input);
    return ServerActionSuccess();
  });
