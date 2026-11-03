import { flushPending, type IntegrationRequest, receiveRequest, type ThrottleEntry } from '@/features/integration/domain';

type Send = (request: IntegrationRequest) => Promise<void>;

type ThrottleState = Map<string, { entry: ThrottleEntry; timer?: ReturnType<typeof setTimeout> }>;

const STATE_KEY = Symbol.for('cartographie.integration-request-throttle');

const globalState = (): ThrottleState => {
  const holder = globalThis as typeof globalThis & { [STATE_KEY]?: ThrottleState };
  holder[STATE_KEY] ??= new Map();
  return holder[STATE_KEY];
};

export const throttledIntegrationRequest =
  (send: Send, state: ThrottleState = globalState()) =>
  async (request: IntegrationRequest): Promise<void> => {
    const key = request.email.toLowerCase();
    const current = state.get(key);
    const decision = receiveRequest(current?.entry, request, Date.now());

    if (decision.dispatch === 'now') {
      if (current?.timer) clearTimeout(current.timer);
      state.set(key, { entry: decision.entry });
      await send(request);
      return;
    }

    if (decision.dispatch === 'later') {
      const timer = setTimeout(async () => {
        const scheduled = state.get(key);
        if (scheduled == null) return;
        const { entry, request: pending } = flushPending(scheduled.entry, Date.now());
        state.set(key, { entry });
        if (pending) await send(pending);
      }, decision.at - Date.now());
      timer.unref?.();
      state.set(key, { entry: decision.entry, timer });
      return;
    }

    state.set(key, { entry: decision.entry, ...(current?.timer ? { timer: current.timer } : {}) });
  };
