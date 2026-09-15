import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';

function load(file, dependencies = {}, globals = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, { exports, Date, Request, AbortSignal, ...globals,
    require: name => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}
const attempt = load('lib/reservations/attempt.ts');
const dates = load('lib/reservations/dates.ts');
const id = '12345678-1234-4234-8234-123456789012';
const userId = 'traveler';
function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ attemptId: id, listingId: 'hotel-one', category: 'hotel', startDate: '2099-02-01', endDate: '2099-02-03', partySize: '2' })) data.set(key, value);
  return data;
}
function setup({ lostResponse = false, unavailable = false, rejectWrite = false, existing } = {}) {
  const rows = new Map(existing ? [[id, existing]] : []);
  const requests = [];
  let offline = unavailable;
  let lose = lostResponse;
  const client = createClient('https://test.supabase.co', 'test-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: async (input, init) => {
      const url = new URL(input);
      requests.push({ url, method: init.method });
      if (offline) return new Response(JSON.stringify({ message: 'unavailable' }), { status: 503 });
      if (url.pathname.endsWith('/listings')) return Response.json([{ id: 'hotel-one', price: 100 }]);
      if (init.method === 'POST') {
        const row = JSON.parse(init.body);
        if (rejectWrite || rows.has(row.id)) return new Response(JSON.stringify({ code: '23505', message: 'conflict' }), { status: 409 });
        rows.set(row.id, row);
        if (lose) { lose = false; offline = true; throw new TypeError('response lost after commit'); }
        return Response.json({ id: row.id });
      }
      const matches = [...rows.values()].filter(row => ['id', 'user_id', 'listing_id'].every(key => url.searchParams.get(key) === `eq.${row[key]}`));
      return Response.json(matches.map(row => ({ id: row.id })));
    } },
  });
  client.auth.getUser = async () => ({ data: { user: { id: userId } }, error: null });
  const { createReservation } = load('app/checkout/actions.ts', {
    '@/lib/reservations/attempt': attempt,
    '@/lib/reservations/dates': dates,
    '@/lib/supabase/auth-server': { createAuthSupabaseClient: async () => client },
    'next/navigation': { redirect: path => { throw new Error(`REDIRECT:${path}`); } },
  });
  return { client, rows, requests, createReservation, reconnect: () => { offline = false; } };
}
const expectReservation = promise => assert.rejects(promise, new RegExp(`^Error: REDIRECT:/reservations/${id}$`));

test('successful retries reuse the original reservation without overwriting changed details', async () => {
  const env = setup();
  await expectReservation(env.createReservation(undefined, form()));
  const changed = form(); changed.set('partySize', '4');
  await expectReservation(env.createReservation(undefined, changed));
  assert.equal(env.rows.size, 1);
  assert.equal(env.rows.get(id).party_size, 2);
  assert.equal(env.requests.filter(r => r.method === 'POST').length, 1);
});
test('lost commit response stays uncertain until reconnect and never creates a second booking', async () => {
  const env = setup({ lostResponse: true });
  const result = await env.createReservation(undefined, form());
  assert.match(result.error, /could not confirm/);
  assert.equal(env.rows.size, 1);
  env.reconnect();
  await expectReservation(env.createReservation(result, form()));
  assert.equal(env.requests.filter(r => r.method === 'POST').length, 1);
});
test('concurrent attempts reconcile the unique-key conflict to the same booking', async () => {
  const env = setup();
  await Promise.all([expectReservation(env.createReservation(undefined, form())), expectReservation(env.createReservation(undefined, form()))]);
  assert.equal(env.rows.size, 1);
});
test('an unavailable authoritative read prevents writes and success', async () => {
  const env = setup({ unavailable: true });
  assert.match((await env.createReservation(undefined, form())).error, /could not confirm/);
  assert.equal(env.requests.filter(r => r.method === 'POST').length, 0);
});
test('a rejected write cannot be reported as successful', async () => {
  const env = setup({ rejectWrite: true });
  assert.match((await env.createReservation(undefined, form())).error, /could not confirm/);
  assert.equal(env.rows.size, 0);
});
test('another traveler or listing cannot be recovered using a guessed attempt ID', async () => {
  for (const existing of [{ id, user_id: 'someone-else', listing_id: 'hotel-one' }, { id, user_id: userId, listing_id: 'hotel-two' }]) {
    const env = setup({ existing });
    assert.match((await env.createReservation(undefined, form())).error, /could not confirm/);
    assert.equal(env.rows.get(id), existing);
  }
});
test('malformed attempt IDs fail before contacting the database', async () => {
  const env = setup(); const data = form(); data.set('attemptId', 'invalid');
  assert.match((await env.createReservation(undefined, data)).error, /Reload checkout/);
  assert.equal(env.requests.length, 0);
});
test('authoritative transport bypasses cache and honors caller cancellation', async () => {
  let options;
  const { consistentFetch } = load('lib/supabase/consistent-fetch.ts', {}, {
    fetch: async (_, init) => { options = init; return Response.json({}); },
  });
  const controller = new AbortController();
  await consistentFetch('https://test.supabase.co', { cache: 'force-cache', signal: controller.signal });
  assert.equal(options.cache, 'no-store');
  assert.equal(options.signal.aborted, false);
  controller.abort();
  assert.equal(options.signal.aborted, true);
});
test('authoritative transport installs the ten-second deadline', async () => {
  let deadline;
  const { consistentFetch } = load('lib/supabase/consistent-fetch.ts', {}, {
    AbortSignal: { timeout: ms => { deadline = ms; return new AbortController().signal; } },
    fetch: async () => Response.json({}),
  });
  await consistentFetch('https://test.supabase.co');
  assert.equal(deadline, 10_000);
});

function checkoutPage(client) {
  return load('app/checkout/[category]/[id]/page.tsx', {
    'react/jsx-runtime': {},
    'lucide-react': {},
    'next/link': {},
    '../../../PageShell': {},
    '../../CheckoutForm': {},
    'node:crypto': { randomUUID: () => id },
    '@/lib/listings/queries': { getListing: () => { throw new Error('Listing must not be read during recovery'); } },
    '@/lib/supabase/auth-server': { createAuthSupabaseClient: async () => client },
    '@/lib/reservations/attempt': attempt,
    'next/navigation': { redirect: path => { throw new Error(`REDIRECT:${path}`); } },
  }).default;
}
test('checkout allocates a durable URL before showing the form', async () => {
  const page = checkoutPage(null);
  await assert.rejects(page({ params: Promise.resolve({ category: 'hotel', id: 'hotel-one' }), searchParams: Promise.resolve({}) }),
    error => error.message === `REDIRECT:/checkout/hotel/hotel-one?attempt=${id}`);
});
test('sign-in redirects retain the original checkout attempt', async () => {
  const page = checkoutPage({ auth: { getUser: async () => ({ data: { user: null } }) } });
  await assert.rejects(page({ params: Promise.resolve({ category: 'hotel', id: 'hotel-one' }), searchParams: Promise.resolve({ attempt: id }) }),
    error => decodeURIComponent(error.message) === `REDIRECT:/login?next=/checkout/hotel/hotel-one?attempt=${id}`);
});
test('refresh recovers a committed booking before checking current listing availability', async () => {
  const env = setup({ existing: { id, user_id: userId, listing_id: 'hotel-one' } });
  await expectReservation(checkoutPage(env.client)({ params: Promise.resolve({ category: 'hotel', id: 'hotel-one' }), searchParams: Promise.resolve({ attempt: id }) }));
});
