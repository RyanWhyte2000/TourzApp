// Authoritative reads must not fall back to a stale Next.js data cache.
// An aborted write has an unknown outcome; callers must reconcile before retrying.
export const consistentFetch: typeof fetch = (input, init) => {
  const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
  const timeout = AbortSignal.timeout(10_000);
  return fetch(input, {
    ...init,
    cache: "no-store",
    signal: callerSignal ? AbortSignal.any([callerSignal, timeout]) : timeout,
  });
};
