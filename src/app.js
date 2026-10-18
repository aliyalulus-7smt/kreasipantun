import { phenomena, stages, sliceIds } from './data.js';
import { getState, saveStage, syncDevice, resolveConflict, createConflictDemo, progress } from './store.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let state;
let device = 'A';
let offlineDemo = sessionStorage.getItem('kp-offline') === 'true';
let pending = Promise.resolve();
let saving = 0;
let saveError = '';
let renderVersion = 0;
let toastTimer;
const isOffline = () => offlineDemo || !navigator.onLine;
const records = () => state?.devices[device].records || {};
const record = id => records()[id];
const stageLabel = entry => entry?.payload.done ? 'Selesai' : entry ? 'Sedang dikerjakan' : 'Belum mulai';
const syncLabel = entry => entry?.conflict ? 'Konflik perlu ditinjau' : entry?.dirty ? 'Menunggu sinkron' : entry ? 'Tersinkron · simulasi lokal' : 'Belum ada perubahan';
const currentRoute = () => location.hash.slice(1).split('/');
function notify(message) {
  $('#notice').textContent = message; $('#notice').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#notice').hidden = true; }, 4500);
}
function showError(error) {
  saveError = `Gagal menyimpan. Perubahan belum diakui tersimpan: ${error.message || 'penyimpanan ditolak'}`;
  if ($('#local-save')) $('#local-save').textContent = saveError;
  updateStatus(); notify(saveError);
}
function updateStatus() {
  $('#network-dot').classList.toggle('offline', isOffline());
  $('#network-label').textContent = isOffline() ? (offlineDemo ? 'Offline · simulasi' : 'Offline') : 'Online';
  $('#toggle-offline').textContent = offlineDemo ? 'Akhiri simulasi offline' : 'Simulasikan offline';
  const entries = Object.values(records());
  const conflicts = entries.filter(entry => entry.conflict).length;
  const dirty = entries.filter(entry => entry.dirty).length;
  $('#save-status').textContent = saveError || (saving ? 'Menyimpan di perangkat…' : conflicts ? `${conflicts} konflik perlu ditinjau` : dirty ? `Tersimpan di perangkat ${device} · ${dirty} menunggu sinkron` : entries.length ? 'Tersinkron · server simulasi lokal' : `Perangkat ${device} · belum ada perubahan`);
  $('#save-status').classList.toggle('error-text', Boolean(saveError || conflicts));
}
function deviceTools() {
  return `<div class="device-tools"><label for="device">Perangkat simulasi</label><select id="device"><option value="A" ${device === 'A' ? 'selected' : ''}>Perangkat A</option><option value="B" ${device === 'B' ? 'selected' : ''}>Perangkat B</option></select><button type="button" id="sync-now" class="button secondary" ${isOffline() ? 'disabled' : ''}>Sinkronkan demo</button></div>`;
}
function home() {
  const p = progress(records(), sliceIds);
  return `<div class="page-top"><div><p class="overline">RUANG EKSPLORASI</p><h1>Temukan ide.<br>Rangkai jadi <em>pantun.</em></h1><p class="lead">Mulai dari fenomena yang menarik perhatianmu.<br class="desktop"> Tidak ada urutan wajib untuk berkreasi.</p></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="paper"><span>sebuah ide,</span><span>sebaris kata,</span><strong>cerita kita.</strong><i></i></div><span class="art-star">✳</span><span class="art-label">RUANG UNTUK IDEMU</span></div></div>
  <section class="continue-card"><div class="continue-icon" aria-hidden="true">↗</div><div><span class="eyebrow">SATU SLICE SIAP DICOBA</span><h2>Bijak Berteknologi</h2><p>${p.completed} dari 5 tahap selesai · progres demo, bukan nilai</p></div><div class="continue-progress"><span>${p.percent}%</span><progress value="${p.completed}" max="5" aria-label="Progres fenomena Bijak Berteknologi"></progress></div><a class="button primary" href="#fenomena/teknologi">${p.completed ? 'Lanjutkan eksplorasi' : 'Mulai eksplorasi'} <span aria-hidden="true">↗</span></a></section>
  <div class="section-heading"><div><p class="overline">DELAPAN SUDUT PANDANG</p><h2>Pilih fenomenamu</h2></div><span class="subtle">01 demo interaktif / 07 placeholder</span></div>
  <section class="phenomena-grid" aria-label="Delapan fenomena">${phenomena.map(item => `<a class="phenomenon-card ${item.color}" href="#fenomena/${item.id}"><div class="card-top"><span class="card-number">${item.code} /</span><span class="badge ${item.ready ? 'ready' : ''}">${item.ready ? 'Slice demo' : 'Belum disahkan'}</span></div><span class="card-mark" aria-hidden="true">${item.mark}</span><div><p class="eyebrow">${item.tag}</p><h3>${item.title}</h3></div><div class="card-bottom"><span>${item.ready ? `${p.completed}/5 tahap demo selesai` : 'Placeholder · materi belum tersedia'}</span><span aria-hidden="true">↗</span></div></a>`).join('')}</section><div class="content-note"><strong>Belajar tanpa terburu-buru.</strong><p>Semua fenomena dapat dilihat. Hanya Bijak Berteknologi memiliki aktivitas sintetis untuk menguji prototipe; tidak ada materi atau kunci jawaban final.</p></div>`;
}
function stageTabs(id, active) {
  return `<nav class="stage-nav" aria-label="Lima tahap bebas urutan">${stages.map((stage, index) => `<a href="#fenomena/${id}/${stage.id}" ${active === stage.id ? 'aria-current="step"' : ''}><span class="step-index">${record(`${id}:${stage.id}`)?.payload.done ? '✓' : String(index + 1).padStart(2,'0')}</span><span>${stage.short}<small>${stageLabel(record(`${id}:${stage.id}`))}</small></span></a>`).join('')}</nav>`;
}
function conflictPanel(id, entry) {
  if (!entry?.conflict) return '';
  return `<section class="conflict-panel" aria-label="Konflik versi"><p class="eyebrow">DUA VERSI TETAP DISIMPAN</p><h3>Pilih versi yang ingin dilanjutkan</h3><p>Perubahan pada aktivitas yang sama tidak digabung diam-diam. Kedua versi diarsipkan secara lokal saat kamu memilih.</p><div class="version-grid"><div><h4>Versi perangkat ${device}</h4><pre>${escape(JSON.stringify(entry.conflict.local, null, 2))}</pre><button class="button secondary" data-resolve="local" data-id="${id}">Pakai versi perangkat ini</button></div><div><h4>Versi server simulasi</h4><pre>${escape(JSON.stringify(entry.conflict.remote, null, 2))}</pre><button class="button secondary" data-resolve="remote" data-id="${id}">Pakai versi server simulasi</button></div></div></section>`;
}
function phenomenon(id, stageId) {
  const item = phenomena.find(item => item.id === id);
  if (!item) return `<h1>Fenomena tidak ditemukan</h1><a href="#beranda">Kembali ke beranda</a>`;
  const active = stages.find(stage => stage.id === stageId);
  const p = progress(records(), stages.map(stage => `${id}:${stage.id}`));
  const intro = `<a class="back-link" href="#beranda">← Semua fenomena</a><div class="detail-heading"><div><p class="overline">FENOMENA ${item.code} · ${item.ready ? 'SLICE SINTETIS' : 'PLACEHOLDER'}</p><h1>${item.title}</h1><p class="lead">${item.ready ? 'Lima tahap, bebas urutan. Mulai dari rasa ingin tahumu.' : 'Konten belum disiapkan atau disahkan. Ini hanya pratinjau struktur.'}</p></div><span class="round-mark ${item.color}" aria-hidden="true">${item.mark}</span></div>${deviceTools()}${stageTabs(id, active?.id)}`;
  if (!item.ready) return `${intro}<section class="empty-state"><span class="eyebrow">BELUM DISAHKAN</span><h2>${active ? active.title : 'Materi sedang menunggu persiapan'}</h2><p>Belum ada stimulus, latihan, kunci, atau rubrik final untuk fenomena ini. Semua tahap dapat dilihat bebas, tetapi tidak dapat ditandai selesai.</p><a class="button primary" href="#fenomena/teknologi">Coba slice Bijak Berteknologi</a></section>`;
  if (!active) return `${intro}<section class="overview"><div><span class="eyebrow">PERJALANANMU</span><h2>Setiap tahap punya ruangnya.</h2><p>Pilih salah satu tahap di atas. Membuka tahap saja tidak mengubah progres. Tandai selesai sendiri untuk mendemokan alur; ini bukan penilaian kemampuan.</p><a class="button primary" href="#fenomena/teknologi/kenali">Buka Kenali Fenomena ↗</a><a class="text-link" href="#fenomena/teknologi/evaluasi">Atau langsung ke Evaluasi Karya →</a></div><div class="progress-summary"><strong>${p.percent}<small>%</small></strong><span>${p.completed} dari 5 tahap selesai</span><progress value="${p.completed}" max="5" aria-label="Progres fenomena"></progress><p>${p.completed === 5 ? 'Fenomena selesai menurut aturan demo.' : p.completed ? 'Fenomena sedang dikerjakan.' : 'Belum ada tahap selesai.'}</p></div></section>`;
  const key = `${id}:${active.id}`;
  const entry = record(key);
  const payload = entry?.payload || {};
  return `${intro}<section class="activity"><div class="activity-heading"><div><span class="eyebrow">AKTIVITAS SINTETIS · BUKAN MATERI FINAL</span><h2>${active.title}</h2></div><span class="badge ready" id="stage-status">${stageLabel(entry)}</span></div><div class="stimulus"><span class="eyebrow">${active.label}</span><p>${active.prompt}</p></div>${conflictPanel(key, entry)}<form id="activity-form" data-key="${key}"><fieldset ${entry?.conflict ? 'disabled' : ''}>${active.id === 'eksplorasi' ? `<div class="choice-group" role="group" aria-label="Pilihan tindakan demo">${['Berhenti sejenak','Melanjutkan menulis'].map(choice => `<label class="choice"><input type="radio" name="choice" value="${choice}" ${payload.choice === choice ? 'checked' : ''}>${choice}</label>`).join('')}</div>` : ''}<label class="field-label" for="answer">${active.field}</label><textarea id="answer" name="answer" rows="${active.id === 'kreativitas' || active.id === 'ekspresikan' ? '7' : '4'}" maxlength="10000" placeholder="${active.placeholder}">${escape(payload.answer)}</textarea>${active.id === 'evaluasi' ? `<label class="check-row"><input type="checkbox" name="reviewed" ${payload.reviewed ? 'checked' : ''}> Saya sudah melihat kembali catatan demo saya (opsional).</label>` : ''}<p class="field-hint">${active.hint}</p><div class="activity-actions"><button class="button secondary" type="submit">Simpan sekarang</button><button class="button primary" id="mark-done" type="button">${payload.done ? 'Buka kembali tahap' : 'Tandai selesai (demo)'}</button></div></fieldset><p class="local-save" id="local-save" aria-live="polite">${syncLabel(entry)} · simpan otomatis saat mengetik</p></form><p class="rule-note">Aturan sementara prototipe: tahap selesai saat kamu menekan tombol “Tandai selesai”. Fenomena selesai jika 5/5 tahap selesai. Aturan ini belum disahkan.</p></section>`;
}
function gallery() {
  const draft = record('teknologi:kreativitas');
  return `<p class="overline">RUANG PRIBADI · DEMO</p><h1>Draf saya</h1><p class="lead">Satu draf sintetis, hanya di browser ini.</p>${deviceTools()}<section class="activity"><span class="badge ready">Bijak Berteknologi</span><h2>Catatan yang sedang tumbuh</h2><pre class="draft">${escape(draft?.payload.answer || 'Belum ada draf pada perangkat simulasi ini.')}</pre><p>${syncLabel(draft)}</p><a class="button primary" href="#fenomena/teknologi/kreativitas">${draft ? 'Lanjutkan draf' : 'Mulai menulis'}</a></section><div class="content-note"><strong>Belum ada keamanan akun nyata.</strong><p>Galeri ini tidak dibagikan ke internet, tetapi orang yang memakai profil browser yang sama dapat melihat data demo. Jangan masukkan data siswa asli.</p></div>`;
}
function lab() {
  const conflicts = Object.entries(records()).filter(([,entry]) => entry.conflict);
  return `<p class="overline">LAB LOKAL · TANPA BACKEND</p><h1>Dua perangkat.<br>Satu ide yang tetap utuh.</h1><p class="lead">Perangkat A, B, dan “server” di bawah adalah tiga ruang data di IndexedDB browser yang sama. Bukan sinkronisasi lintas HP sungguhan.</p>${deviceTools()}<section class="activity"><h2>Coba konflik, tanpa kehilangan versi</h2><ol class="guide-list"><li>Demo membuat salinan awal untuk A dan B pada aktivitas lab terpisah.</li><li>Keduanya mengubah aktivitas yang sama. B mengirim lebih dahulu.</li><li>A mendeteksi versi berbeda. Pilih versi yang dilanjutkan, lalu sinkronkan lagi.</li></ol><button class="button primary" id="create-conflict" ${isOffline() ? 'disabled' : ''}>Buat contoh konflik A ↔ B</button><p class="field-hint">Hanya mengubah data lab. Jawaban lima tahapmu tidak diganti.</p></section>${conflicts.map(([id, entry]) => conflictPanel(id, entry)).join('') || '<div class="content-note"><strong>Tidak ada konflik pada perangkat ini.</strong><p>Kamu juga bisa mengedit tahap yang sama di A dan B secara manual untuk mencoba konflik.</p></div>'}<div class="version-grid lab-grid">${['A','B'].map(key => `<section class="activity"><span class="eyebrow">PERANGKAT ${key}</span><h3>Snapshot lokal</h3>${Object.entries(state.devices[key].records).map(([id, entry]) => `<div class="snapshot-row"><strong>${escape(id)}</strong><small>${syncLabel(entry)}</small><p>${escape(entry.payload.answer || '(respons tanpa teks)')}</p></div>`).join('') || '<p>Belum ada perubahan.</p>'}</section>`).join('')}</div><section class="content-note"><strong>Arsip resolusi: ${state.archive.length} catatan lokal.</strong><p>Versi asal tetap diarsipkan ketika konflik diselesaikan. Arsip bukan cadangan eksternal dan akan hilang jika penyimpanan browser dihapus.</p></section>`;
}
function guide() {
  return `<p class="overline">PANDUAN PROTOTIPE</p><h1>Kecil cakupannya.<br>Jelas batasannya.</h1><section class="activity prose"><h2>Yang bisa kamu coba</h2><p>Delapan fenomena terlihat. Satu fenomena memiliki lima tahap dengan input sintetis dan urutan bebas. Membuka halaman tidak menandai selesai.</p><h3>Menyimpan dan melanjutkan</h3><p>Input otomatis disimpan ke IndexedDB browser. Tunggu status “Tersimpan di perangkat” sebelum menutup. Jika penyimpanan ditolak, aplikasi menampilkan kegagalan dan tidak mengakui data tersimpan. Perubahan tertunda akan dicoba sinkron saat koneksi pulih, atau melalui tombol sinkron.</p><h3>Offline sungguhan dan simulasi</h3><p>Buka sekali melalui localhost atau HTTPS sampai paket offline siap. Setelah itu aset aplikasi dapat dibuka ulang tanpa internet. Tombol simulasi offline hanya memutus alur sinkron demo, tidak mematikan jaringan perangkat.</p><p id="offline-ready">Memeriksa paket offline…</p><h3>Belum untuk penggunaan siswa</h3><p>Belum ada login, role Guru/Super Admin, kelas, keamanan akun, server, penilaian, rubrik, rekomendasi, maupun sinkron antarperangkat nyata. Konten bukan materi disahkan. Progres bukan nilai kompetensi.</p><h3>Penyimpanan punya batas</h3><p>Data ada pada origin dan profil browser ini. Penghapusan data situs, mode privat, atau kebijakan OS/browser bisa menghapusnya. Jangan memakai identitas, karya asli siswa, atau data sensitif.</p><a class="button primary" href="#lab">Buka lab sinkronisasi ↔</a></section>`;
}
async function render() {
  const version = ++renderVersion;
  await pending;
  const nextState = await getState();
  if (version !== renderVersion) return;
  state = nextState;
  const [route, id, stage] = currentRoute();
  document.querySelectorAll('[data-nav]').forEach(link => {
    const selected = link.dataset.nav === (route === 'fenomena' || !route ? 'beranda' : route);
    selected ? link.setAttribute('aria-current','page') : link.removeAttribute('aria-current');
  });
  $('#main').innerHTML = route === 'fenomena' ? phenomenon(id,stage) : route === 'karya' ? gallery() : route === 'lab' ? lab() : route === 'panduan' ? guide() : home();
  updateStatus(); bind();
  if ($('#offline-ready')) $('#offline-ready').textContent = await offlineReadiness();
}
function capturePayload(done) {
  const form = $('#activity-form');
  const data = new FormData(form);
  const old = record(form.dataset.key)?.payload || {};
  return { answer:String(data.get('answer') || ''), choice:String(data.get('choice') || ''), reviewed:data.has('reviewed'), done:done ?? old.done ?? false, context:'jeda sebelum mengirim pesan · demo-v1' };
}
function saveCurrent(done) {
  const key = $('#activity-form').dataset.key;
  const payload = capturePayload(done);
  const targetDevice = device;
  saving++; updateStatus();
  $('#local-save').textContent = 'Menyimpan di perangkat…';
  pending = pending.then(async () => {
    state = await saveStage(targetDevice,key,payload); saveError = '';
    if ($('#activity-form')?.dataset.key === key && device === targetDevice) {
      $('#local-save').textContent = 'Tersimpan di perangkat · menunggu sinkron';
      $('#stage-status').textContent = stageLabel(record(key));
      const stageLink = document.querySelector(`.stage-nav a[href="#fenomena/${key.replace(':', '/')}"] small`);
      if (stageLink) stageLink.textContent = stageLabel(record(key));
    }
  }).catch(showError).finally(() => { saving--; updateStatus(); });
  return pending;
}
async function doSync() {
  if (isOffline()) { notify('Offline: perubahan tetap lokal, sinkron ditunda.'); return; }
  await pending;
  try {
    $('#save-status').textContent = 'Sedang sinkron ke simulasi lokal…';
    state = await syncDevice(device); saveError = ''; await render();
    notify(Object.values(records()).some(entry => entry.conflict) ? 'Konflik terdeteksi. Kedua versi tetap tersedia.' : 'Terkonfirmasi di server simulasi lokal, bukan server internet.');
  } catch (error) { showError(error); }
}
function bind() {
  $('#device')?.addEventListener('change', async event => { const next = event.target.value; await pending; device = next; await render(); });
  $('#sync-now')?.addEventListener('click', doSync);
  $('#activity-form')?.addEventListener('input', () => saveCurrent());
  $('#activity-form')?.addEventListener('submit', async event => { event.preventDefault(); await saveCurrent(); if (!saveError) notify('Perubahan tersimpan di IndexedDB perangkat ini.'); });
  $('#mark-done')?.addEventListener('click', async () => { await saveCurrent(!record($('#activity-form').dataset.key)?.payload.done); await render(); });
  $('#create-conflict')?.addEventListener('click', async () => {
    if (isOffline()) return;
    try { await pending; state = await createConflictDemo(); device = 'A'; await render(); notify('Contoh konflik siap pada perangkat A. Data tahapmu tidak diubah.'); } catch(error) { showError(error); }
  });
  document.querySelectorAll('[data-resolve]').forEach(button => button.addEventListener('click', async () => {
    try { await pending; state = await resolveConflict(device,button.dataset.id,button.dataset.resolve); await render(); notify('Kedua versi diarsipkan. Pilihanmu menunggu sinkron.'); } catch(error) { showError(error); }
  }));
}
async function offlineReadiness() {
  if (!('serviceWorker' in navigator)) return 'Paket offline tidak didukung browser ini; penyimpanan tetap dapat diuji saat halaman terbuka.';
  try { const keys = await caches.keys(); return keys.includes('kreasi-pantun-shell-v2') ? 'Paket offline siap. Setelah pemuatan awal, aplikasi dapat dibuka ulang tanpa jaringan.' : 'Paket offline belum siap. Tunggu sebentar lalu muat ulang secara online.'; }
  catch { return 'Status cache tidak tersedia. Pembukaan ulang offline belum dapat dijamin.'; }
}
$('#toggle-offline').addEventListener('click', async () => {
  offlineDemo = !offlineDemo; sessionStorage.setItem('kp-offline', String(offlineDemo)); updateStatus();
  if (!isOffline()) await doSync(); else await render();
});
window.addEventListener('hashchange', () => render().catch(showError));
window.addEventListener('online', () => { if (!isOffline()) doSync(); else updateStatus(); });
window.addEventListener('offline', () => { updateStatus(); render().catch(showError); });
window.addEventListener('beforeunload', event => { if (saving || saveError) { event.preventDefault(); event.returnValue = ''; } });
try {
  await render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => notify('Paket offline gagal disiapkan. Simpan lokal tetap tersedia; buka ulang offline belum siap.'));
} catch (error) {
  $('#main').innerHTML = '<section class="empty-state"><h1>Penyimpanan lokal tidak tersedia</h1><p>Prototipe tidak bisa mengakui progres tersimpan. Coba izinkan penyimpanan situs atau gunakan profil browser biasa. Tidak ada data dikirim ke server.</p></section>';
  showError(error);
}
