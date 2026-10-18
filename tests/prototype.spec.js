import { test, expect } from '@playwright/test';

const phenomena = ['teknologi','lingkungan','menolong','perundungan','belajar','budaya','berbeda','sehat'];
const stages = ['kenali','eksplorasi','ekspresikan','kreativitas','evaluasi'];

async function openApp(page) {
  await page.goto('/#beranda');
  await expect(page.locator('h1').first()).toContainText('Temukan ide');
}
async function clean(page) {
  // Playwright's page fixture creates a fresh browser context for each test.
}
async function waitSaved(page) {
  const local = page.locator('#local-save');
  if (await local.count()) await expect(local).toContainText('Tersimpan di perangkat', { timeout: 5000 });
  await page.waitForTimeout(150);
}

test.beforeEach(async ({ page }) => { await clean(page); });

test('home memuat tepat 8 kartu fenomena dan 7 placeholder', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('.phenomenon-card')).toHaveCount(8);
  await expect(page.locator('.phenomenon-card .badge:not(.ready)')).toHaveCount(7);
  await expect(page.locator('.phenomenon-card .badge.ready')).toHaveCount(1);
});

test('40 kombinasi fenomena/tahap bebas akses; 35 placeholder hanya struktur', async ({ page }) => {
  await openApp(page);
  for (const id of phenomena) {
    await page.goto('/#beranda');
    await page.locator(`a.phenomenon-card[href="#fenomena/${id}"]`).click();
    await expect(page.locator('h1').first()).toBeVisible();
    for (const stage of stages) {
      await page.goto(`/#fenomena/${id}/${stage}`);
      await expect(page.locator('.stage-nav')).toBeVisible();
      if (id === 'teknologi') await expect(page.locator('#activity-form')).toBeVisible();
      else {
        await expect(page.locator('.empty-state')).toContainText('tidak dapat ditandai selesai');
        await expect(page.locator('#activity-form')).toHaveCount(0);
      }
    }
  }
});

test('evaluasi dapat dibuka dan disimpan tanpa prerequisite', async ({ page }) => {
  await openApp(page);
  await page.goto('/#fenomena/teknologi/evaluasi');
  await expect(page.locator('#activity-form')).toBeVisible();
  await page.locator('#answer').fill('Refleksi evaluasi tanpa membuka tahap lain.');
  await page.locator('button[type="submit"]').click();
  await waitSaved(page);
  await expect(page.locator('#stage-status')).toContainText('Sedang dikerjakan');
});

test('lima tahap mendukung simpan, progres selesai, buka kembali, dan restore', async ({ page }) => {
  await openApp(page);
  for (const [i, stage] of stages.entries()) {
    await page.goto(`/#fenomena/teknologi/${stage}`);
    await page.locator('#answer').fill(`Jawaban tahap ${stage}`);
    if (stage === 'eksplorasi') await page.locator('input[type="radio"]').first().check();
    await page.locator('button[type="submit"]').click();
    await waitSaved(page);
    await page.locator('#mark-done').click();
    await expect(page.locator('#stage-status')).toContainText('Selesai');
    if (i === 0) {
      await page.locator('#mark-done').click();
      await expect(page.locator('#stage-status')).toContainText('Sedang dikerjakan');
      await page.locator('#mark-done').click();
    }
  }
  await page.goto('/#fenomena/teknologi');
  await expect(page.locator('.progress-summary')).toContainText('100%');
  await page.reload();
  await page.goto('/#fenomena/teknologi/kreativitas');
  await expect(page.locator('#answer')).toHaveValue('Jawaban tahap kreativitas');
  await expect(page.locator('#stage-status')).toContainText('Selesai');
});

test('refresh dan new page memulihkan state IndexedDB', async ({ page, context }) => {
  await openApp(page);
  await page.goto('/#fenomena/teknologi/kenali');
  await page.locator('#answer').fill('Draf yang harus pulih');
  await page.locator('button[type="submit"]').click();
  await waitSaved(page);
  await page.reload();
  await expect(page.locator('#answer')).toHaveValue('Draf yang harus pulih');
  const second = await context.newPage();
  await second.goto('/#fenomena/teknologi/kenali');
  await expect(second.locator('#answer')).toHaveValue('Draf yang harus pulih');
  await second.close();
});

test('simulasi offline menahan sinkron lalu reconnect manual', async ({ page }) => {
  await openApp(page);
  await page.locator('#toggle-offline').click();
  await expect(page.locator('#network-label')).toContainText('Offline');
  await page.goto('/#fenomena/teknologi/kenali');
  await page.locator('#answer').fill('Menunggu koneksi');
  await waitSaved(page);
  await expect(page.locator('#local-save')).toContainText('menunggu sinkron');
  await page.locator('#toggle-offline').click();
  await expect(page.locator('#network-label')).toContainText('Online');
  await page.locator('#sync-now').click();
  await expect(page.locator('#save-status')).toContainText('Tersinkron', { timeout: 5000 });
});

test('service worker warm cache memungkinkan reload saat jaringan offline', async ({ page, context }) => {
  await openApp(page);
  await page.goto('/#panduan');
  await expect(page.locator('#offline-ready')).toContainText(/Paket offline siap|belum siap/);
  await page.waitForTimeout(800);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('body')).toContainText('PANDUAN PROTOTIPE');
  await context.setOffline(false);
});

test('lab membuat konflik A/B, menyimpan kedua versi, dan dua pilihan resolusi', async ({ page }) => {
  await openApp(page);
  await page.goto('/#lab');
  await page.locator('#create-conflict').click();
  await expect(page.locator('.conflict-panel')).toBeVisible();
  await expect(page.locator('.conflict-panel pre')).toHaveCount(2);
  await expect(page.locator('[data-resolve="local"]')).toBeVisible();
  await expect(page.locator('[data-resolve="remote"]')).toBeVisible();
  await page.locator('[data-resolve="local"]').click();
  await expect(page.locator('.content-note').filter({ hasText: 'Arsip resolusi:' })).toContainText(/Arsip resolusi: 1/);
  await page.locator('#sync-now').click();
  await expect(page.locator('#save-status')).toContainText(/Tersinkron|menunggu sinkron/, { timeout: 5000 });
  await page.locator('#create-conflict').click();
  await page.locator('[data-resolve="remote"]').click();
  await expect(page.locator('.content-note').filter({ hasText: 'Arsip resolusi:' })).toContainText(/Arsip resolusi: 2/);
});

test('lab seed tidak mengubah slice teknologi', async ({ page }) => {
  await openApp(page);
  await page.goto('/#fenomena/teknologi/kreativitas');
  await page.locator('#answer').fill('Jawaban slice tetap utuh');
  await waitSaved(page);
  await page.goto('/#lab');
  await page.locator('#create-conflict').click();
  await page.goto('/#fenomena/teknologi/kreativitas');
  await expect(page.locator('#answer')).toHaveValue('Jawaban slice tetap utuh');
});

test('IndexedDB gagal: aplikasi menampilkan kegagalan dan tidak mengklaim tersimpan', async ({ page }) => {
  await page.addInitScript(() => {
    const original = indexedDB.open.bind(indexedDB);
    indexedDB.open = () => { const r = {}; setTimeout(() => r.onerror?.({ target: { error: new Error('blocked') } }), 0); return r; };
    window.__originalIndexedDBOpen = original;
  });
  await page.goto('/#beranda');
  await expect(page.locator('#main')).toContainText('Penyimpanan lokal tidak tersedia');
  await expect(page.locator('#save-status')).toContainText('Gagal menyimpan');
});

test('input XSS diperlakukan sebagai teks, bukan HTML', async ({ page }) => {
  await openApp(page);
  await page.goto('/#fenomena/teknologi/kenali');
  const xss = '<img src=x onerror="window.__xss=true">&<script>window.__xss=true</script>';
  await page.locator('#answer').fill(xss);
  await page.locator('button[type="submit"]').click();
  await waitSaved(page);
  await page.reload();
  await expect(page.locator('#answer')).toHaveValue(xss);
  await expect(page.locator('img')).toHaveCount(0);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});

test('tidak ada body overflow pada route utama di empat lebar viewport', async ({ page }) => {
  for (const width of [360,390,768,1366]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['#beranda','#fenomena/teknologi','#fenomena/teknologi/kenali','#lab']) {
      await page.goto(`/${route}`);
      await expect(page.locator('body')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${width}px ${route}`).toBeTruthy();
    }
  }
});
