export async function onRequestError() {
  // Required by Next.js instrumentation API
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getAllLieux } = await import('@/libraries/lieux-cache');
    await getAllLieux();
  }
}
