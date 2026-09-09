import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
function load(file, globals = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, { exports, require, URL, Date, ...globals }, { filename: file });
  return exports;
}
test('redirects reject external and normalized network paths but preserve local destinations', () => {
  const { safeNextPath } = load('lib/auth/safe-next.ts');
  for (const path of ['/\\example.com', '//example.com', 'https://example.com', '/\n/example.com', '/a/..//example.com']) assert.equal(safeNextPath(path), '/');
  assert.equal(safeNextPath('/checkout/hotel/test?guests=2#details'), '/checkout/hotel/test?guests=2#details');
  assert.equal(safeNextPath('//example.com', '/wishlist'), '/wishlist');
});
test('reservation dates reject malformed, impossible, missing and reversed end dates', () => {
  const { reservationDates } = load('lib/reservations/dates.ts');
  for (const category of ['hotel', 'airbnb', 'transport']) {
    for (const end of ['', 'garbage', '2028-02-30', '2028-02-27', '2028-02-28']) assert.equal(reservationDates(category, '2028-02-28', end, '12:00'), null);
    assert.ok(reservationDates(category, '2028-02-28', '2028-02-29', '12:00'));
  }
  assert.ok(reservationDates('food', '2028-02-29', '', '19:00'));
  assert.equal(reservationDates('food', '2028-02-29', '', '25:00'), null);
});
function wishlist(fetch) {
  let raw = '[]';
  const window = { localStorage: { getItem: () => raw, setItem: (_, value) => { raw = value; } }, dispatchEvent() {} };
  const react = { useEffect: (fn) => fn(), useSyncExternalStore: (_, snapshot) => snapshot() };
  const store = load('lib/wishlist/store.ts', { window, fetch, Event, require: () => react });
  return { ...store, ids: () => JSON.parse(raw) };
}
const flush = () => new Promise(resolve => setImmediate(resolve));
test('wishlist retries after a failed or anonymous initial sync', async () => {
  for (const failed of [true, false]) {
    let calls = 0;
    const store = wishlist(async () => {
      calls++;
      if (calls === 1 && failed) throw new Error('offline');
      return { ok: true, json: async () => ({ authenticated: calls > 1, ids: calls > 1 ? ['saved'] : [] }) };
    });
    store.useWishlist(); await flush();
    store.useWishlist(); await flush();
    assert.equal(calls, 2);
    assert.deepEqual(store.ids(), ['saved']);
  }
});
test('wishlist preserves a toggle made during initial sync', async () => {
  let resolve;
  const pending = new Promise(r => { resolve = r; });
  const store = wishlist(async (_, options) => options.method === 'POST' ? pending : { ok: true });
  store.useWishlist().toggle('new');
  resolve({ ok: true, json: async () => ({ authenticated: true, ids: [] }) });
  await flush();
  assert.deepEqual(store.ids(), ['new']);
});
