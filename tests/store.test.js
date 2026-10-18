import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DB_NAME, createConflictDemo, getState, progress, resolveConflict, saveStage, syncDevice,
} from '../src/store.js';

const key = 'teknologi:kenali';
const ids = ['teknologi:kenali', 'teknologi:eksplorasi', 'teknologi:ekspresikan'];

async function clearDb() {
  await new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = request.onblocked = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

beforeEach(clearDb);
afterEach(clearDb);

describe('KREASI PANTUN local store', () => {
  it('persists complete payloads and supports free-order progress', async () => {
    const saved = await saveStage('A', 'teknologi:eksplorasi', { answer: 'fakta', done: true, choices: [1, 3] });
    assert.equal(saved.devices.A.records['teknologi:eksplorasi'].payload.choices[1], 3);
    const state = await getState();
    assert.deepEqual(state.devices.A.records['teknologi:eksplorasi'].payload, { answer: 'fakta', done: true, choices: [1, 3] });
    assert.deepEqual(progress(state.devices.A.records, ids), { completed: 1, total: 3, percent: 33, status: 'berjalan' });
    assert.deepEqual(progress({}, []), { completed: 0, total: 0, percent: 0, status: 'belum' });
    assert.equal(progress({ 'teknologi:kenali': { payload: { answer: 'draft' } } }, ids).status, 'berjalan');
  });

  it('merges independent payload fields without losing either device activity', async () => {
    await saveStage('A', key, { answer: 'awal', done: false });
    await syncDevice('A');
    await syncDevice('B');
    await saveStage('A', key, { answer: 'awal', done: false, reflection: 'A' });
    await saveStage('B', key, { answer: 'awal', done: false, hint: 'B' });
    await syncDevice('B');
    const state = await syncDevice('A');
    assert.equal(state.devices.A.records[key].conflict, null);
    assert.equal(state.server.records[key].payload.reflection, 'A');
    assert.equal(state.server.records[key].payload.hint, 'B');
  });

  it('preserves both conflicting versions and archives both on resolution', async () => {
    const conflicted = await createConflictDemo();
    const record = conflicted.devices.A.records['lab:konflik'];
    assert.equal(record.conflict.local.answer, 'Teks sintetis dari perangkat A');
    assert.equal(record.conflict.remote.answer, 'Teks sintetis dari perangkat B');
    assert.equal(conflicted.devices.B.records['lab:konflik'].payload.answer, 'Teks sintetis dari perangkat B');
    const resolved = await resolveConflict('A', 'lab:konflik', 'local');
    assert.equal(resolved.archive.length, 1);
    assert.equal(resolved.archive[0].local.answer, 'Teks sintetis dari perangkat A');
    assert.equal(resolved.archive[0].remote.answer, 'Teks sintetis dari perangkat B');
    assert.equal(resolved.devices.A.records['lab:konflik'].dirty, true);
    const synced = await syncDevice('A');
    assert.equal(synced.devices.A.records['lab:konflik'].dirty, false);
    assert.equal(synced.server.records['lab:konflik'].payload.answer, 'Teks sintetis dari perangkat A');
    assert.equal((await syncDevice('A')).server.records['lab:konflik'].version, synced.server.records['lab:konflik'].version);
  });

  it('keeps conflict when edited and supports remote resolution', async () => {
    await createConflictDemo();
    const before = await getState();
    await assert.rejects(() => saveStage('A', 'lab:konflik', { answer: 'attempt', done: true }), /Konflik harus diselesaikan/);
    assert.deepEqual((await getState()).devices.A.records['lab:konflik'].conflict, before.devices.A.records['lab:konflik'].conflict);
    const resolved = await resolveConflict('A', 'lab:konflik', 'remote');
    assert.equal(resolved.devices.A.records['lab:konflik'].dirty, true);
    assert.equal(resolved.devices.A.records['lab:konflik'].baseVersion, 2);
    assert.equal(resolved.devices.A.records['lab:konflik'].version, 3);
    assert.equal(resolved.devices.A.records['lab:konflik'].payload.answer, 'Teks sintetis dari perangkat B');
    const synced = await syncDevice('A');
    assert.equal(synced.devices.A.records['lab:konflik'].dirty, false);
    assert.equal(synced.server.records['lab:konflik'].version, 3);
  });

  it('tests both conflict choices with consistent remote-version bases', async () => {
    await createConflictDemo();
    const local = await resolveConflict('A', 'lab:konflik', 'local');
    assert.equal(local.devices.A.records['lab:konflik'].baseVersion, 2);
    assert.equal(local.devices.A.records['lab:konflik'].version, 3);
    assert.equal(local.devices.A.records['lab:konflik'].dirty, true);
    await clearDb();
    await createConflictDemo();
    const remote = await resolveConflict('A', 'lab:konflik', 'remote');
    assert.equal(remote.devices.A.records['lab:konflik'].baseVersion, 2);
    assert.equal(remote.devices.A.records['lab:konflik'].version, 3);
    assert.equal(remote.devices.A.records['lab:konflik'].dirty, true);
  });

  it('creates only the conflict fixture and preserves unsynced slices and archive', async () => {
    await saveStage('A', 'unsynced', { answer: 'tetap', done: false });
    await saveStage('B', 'other', { answer: 'tetap juga', done: false });
    await createConflictDemo();
    await resolveConflict('A', 'lab:konflik', 'local');
    const before = await getState();
    await createConflictDemo();
    const after = await getState();
    assert.deepEqual(after.devices.A.records.unsynced, before.devices.A.records.unsynced);
    assert.deepEqual(after.devices.B.records.other, before.devices.B.records.other);
    assert.equal(after.server.records.unsynced, undefined);
    assert.equal(after.archive.length, before.archive.length);
  });

  it('does not duplicate revisions on idempotent retries and survives 20 cycles', async () => {
    await saveStage('A', key, { answer: '0', done: false });
    await syncDevice('A');
    const first = await getState();
    await syncDevice('A');
    assert.equal((await getState()).server.records[key].version, first.server.records[key].version);
    for (let i = 1; i <= 20; i += 1) {
      await saveStage('A', key, { answer: String(i), done: i === 20 });
      await syncDevice('A');
      await syncDevice('B');
    }
    const state = await getState();
    assert.equal(state.server.records[key].payload.answer, '20');
    assert.equal(state.devices.B.records[key].payload.answer, '20');
    assert.equal(state.server.records[key].version, 21);
  });

  it('serializes concurrent saves in one IndexedDB transaction', async () => {
    await Promise.all([
      saveStage('A', 'a', { answer: 'a', done: false }),
      saveStage('A', 'b', { answer: 'b', done: false }),
      saveStage('B', 'c', { answer: 'c', done: false }),
    ]);
    const state = await getState();
    assert.deepEqual(Object.keys(state.devices.A.records).sort(), ['a', 'b']);
    assert.deepEqual(Object.keys(state.devices.B.records), ['c']);
  });
});
