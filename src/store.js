const DB_NAME = 'kreasi-pantun-demo-v1';
const STORE_NAME = 'state';
const STATE_KEY = 'singleton';

const emptyState = () => ({
  devices: { A: { records: {} }, B: { records: {} } },
  server: { records: {} },
  archive: [],
});

const clone = (value) => (typeof structuredClone === 'function'
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value)));

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB tidak tersedia'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Gagal membuka IndexedDB'));
  });
}

function transactionResult(db, mode, operation) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    let value;
    let operationError;
    const fail = (error) => {
      operationError = error || new Error('Operasi IndexedDB gagal');
      try { tx.abort(); } catch (_) { /* transaction already finished */ }
    };
    try {
      operation(store, (result) => { value = result; }, fail);
    } catch (error) {
      fail(error);
    }
    tx.oncomplete = () => operationError ? reject(operationError) : resolve(value);
    tx.onerror = () => reject(operationError || tx.error || new Error('Transaksi IndexedDB gagal'));
    tx.onabort = () => reject(operationError || tx.error || new Error('Transaksi IndexedDB dibatalkan'));
  });
}

async function readModifyWrite(mutator) {
  const db = await openDb();
  try {
    return await transactionResult(db, 'readwrite', (store, done, fail) => {
      const get = store.get(STATE_KEY);
      get.onerror = () => fail(get.error || new Error('Gagal membaca state'));
      get.onsuccess = () => {
        try {
          const current = get.result ? clone(get.result) : emptyState();
          const next = mutator(current);
          store.put(next, STATE_KEY);
          done(clone(next));
        } catch (error) { fail(error); }
      };
    });
  } finally {
    db.close();
  }
}

async function readState() {
  const db = await openDb();
  try {
    return await transactionResult(db, 'readonly', (store, done, fail) => {
      const request = store.get(STATE_KEY);
      request.onerror = () => fail(request.error || new Error('Gagal membaca state'));
      request.onsuccess = () => {
        try {
          done(request.result ? clone(request.result) : emptyState());
        } catch (error) { fail(error); }
      };
    });
  } finally {
    db.close();
  }
}

const validDevice = (device) => {
  if (device !== 'A' && device !== 'B') throw new Error('device harus A atau B');
};

const now = () => new Date().toISOString();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export async function getState() {
  return readState();
}

export async function saveStage(device, id, payload) {
  validDevice(device);
  if (!id || typeof payload !== 'object' || payload === null) throw new Error('id dan payload wajib valid');
  return readModifyWrite((state) => {
    const records = state.devices[device].records;
    const previous = records[id];
    // A conflict remains visible and actionable; editing it is rejected rather than losing either version.
    if (previous?.conflict) throw new Error('Konflik harus diselesaikan sebelum menyimpan');
    const version = previous ? Math.max(previous.version + 1, previous.baseVersion + 1) : 1;
    records[id] = {
      payload: clone(payload),
      baseVersion: previous?.baseVersion ?? 0,
      version,
      dirty: true,
      updatedAt: now(),
      conflict: null,
    };
    return state;
  });
}

function makeServerRecord(record, version) {
  return {
    payload: clone(record.payload),
    baseVersion: version,
    version,
    dirty: false,
    updatedAt: record.updatedAt,
    conflict: null,
  };
}

function syncOne(state, device, id, local) {
  const remote = state.server.records[id];
  if (!local.dirty) {
    if (remote && (!state.devices[device].records[id] || local.baseVersion < remote.version)) {
      state.devices[device].records[id] = clone(remote);
    }
    return;
  }
  if (local.conflict) return;
  if (!remote) {
    const version = Math.max(1, local.version);
    state.server.records[id] = makeServerRecord(local, version);
    local.version = version;
    local.baseVersion = version;
    local.dirty = false;
    return;
  }
  if (local.baseVersion === remote.version) {
    // Repeating a completed sync is a no-op because dirty is false; each new edit is one new server revision.
    const version = Math.max(remote.version + 1, local.version);
    state.server.records[id] = makeServerRecord(local, version);
    local.version = version;
    local.baseVersion = version;
    local.dirty = false;
    return;
  }
  const localPayload = local.payload;
  const remotePayload = remote.payload;
  const localKeys = Object.keys(localPayload);
  const remoteKeys = Object.keys(remotePayload);
  const overlappingChange = localKeys.some((key) => Object.prototype.hasOwnProperty.call(remotePayload, key)
    && !same(localPayload[key], remotePayload[key]));
  if (!overlappingChange) {
    const merged = { ...remotePayload, ...localPayload };
    const mergedRecord = { ...local, payload: merged, baseVersion: remote.version, version: remote.version + 1 };
    state.server.records[id] = makeServerRecord(mergedRecord, remote.version + 1);
    local.payload = clone(merged);
    local.baseVersion = remote.version + 1;
    local.version = remote.version + 1;
    local.dirty = false;
    local.updatedAt = now();
    return;
  }
  local.conflict = {
    local: clone(local.payload),
    remote: clone(remote.payload),
    remoteVersion: remote.version,
  };
}

export async function syncDevice(device) {
  validDevice(device);
  return readModifyWrite((state) => {
    const records = state.devices[device].records;
    for (const [id, record] of Object.entries(records)) syncOne(state, device, id, record);
    // A clean device also pulls all newer server records, including records first created elsewhere.
    for (const [id, remote] of Object.entries(state.server.records)) {
      const local = records[id];
      if (!local) records[id] = clone(remote);
      else if (!local.dirty && !local.conflict && local.baseVersion < remote.version) records[id] = clone(remote);
    }
    return state;
  });
}

export async function resolveConflict(device, id, choice) {
  validDevice(device);
  if (choice !== 'local' && choice !== 'remote') throw new Error("choice harus 'local' atau 'remote'");
  return readModifyWrite((state) => {
    const record = state.devices[device].records[id];
    if (!record?.conflict) throw new Error('Konflik tidak ditemukan');
    const conflict = record.conflict;
    state.archive.push({
      device,
      id,
      archivedAt: now(),
      local: clone(conflict.local),
      remote: clone(conflict.remote),
      remoteVersion: conflict.remoteVersion,
    });
    if (choice === 'local') {
      record.payload = clone(conflict.local);
      record.baseVersion = conflict.remoteVersion;
      record.version = conflict.remoteVersion + 1;
      record.dirty = true;
      record.updatedAt = now();
    } else {
      record.payload = clone(conflict.remote);
      record.baseVersion = conflict.remoteVersion;
      record.version = conflict.remoteVersion + 1;
      record.dirty = true;
      record.updatedAt = now();
    }
    record.conflict = null;
    return state;
  });
}

export async function createConflictDemo() {
  return readModifyWrite((state) => {
    const id = 'lab:konflik';
    const local = { answer: 'Teks sintetis dari perangkat A', done: false };
    const remote = { answer: 'Teks sintetis dari perangkat B', done: false };
    const timestamp = now();
    state.server.records[id] = {
      payload: clone(remote), baseVersion: 2, version: 2, dirty: false, updatedAt: timestamp, conflict: null,
    };
    state.devices.B.records[id] = clone(state.server.records[id]);
    state.devices.A.records[id] = {
      payload: clone(local), baseVersion: 1, version: 2, dirty: true, updatedAt: timestamp,
      conflict: { local: clone(local), remote: clone(remote), remoteVersion: 2 },
    };
    return state;
  });
}

export function progress(records, ids) {
  const list = Array.isArray(ids) ? ids : [];
  const completed = list.filter((id) => records?.[id]?.payload?.done === true).length;
  const total = list.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const hasActivity = list.some((id) => Boolean(records?.[id]));
  return { completed, total, percent, status: completed === 0 ? (hasActivity ? 'berjalan' : 'belum') : completed === total ? 'selesai' : 'berjalan' };
}

export { DB_NAME };
