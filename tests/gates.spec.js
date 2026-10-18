import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
const stageIds = ['kenali','eksplorasi','ekspresikan','kreativitas','evaluasi'];
const metrics = {};
test.describe.configure({mode:'serial'});
test.afterAll(async () => {
  await writeFile(new URL('../docs/gate-metrics.json', import.meta.url), JSON.stringify({environment:'Playwright Chromium desktop, localhost:4173; server sinkron simulasi IndexedDB, tanpa backend/network throttle', ...metrics}, null, 2) + '\n');
});
async function ready(page) {
  await page.goto('/#beranda');
  await expect(page.locator('h1')).toContainText('Temukan ide');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
  });
}
test('Q04 mock: 20 siklus offline edit reload online untuk tiap 5 tipe tahap', async ({page,context}) => {
  test.setTimeout(240000);
  await ready(page);
  let cycles = 0;
  for (const stage of stageIds) {
    for (let i=0; i<20; i++) {
      await page.goto(`/#fenomena/teknologi/${stage}`);
      await expect(page.locator('#answer')).toBeVisible();
      await context.setOffline(true);
      await expect(page.locator('#network-label')).toContainText('Offline');
      // Offline event intentionally renders status; acquire the current input after that render.
      await page.waitForTimeout(30);
      const answer = `Sintetis ${stage} siklus ${i}`;
      await page.locator('#answer').fill(answer);
      await expect(page.locator('#local-save')).toContainText('Tersimpan di perangkat');
      await expect(page.locator('#save-status')).toContainText('menunggu sinkron');
      await page.reload();
      await expect(page.locator('#answer')).toHaveValue(answer);
      await context.setOffline(false);
      await expect(page.locator('#save-status')).toContainText('Tersinkron');
      const stored = await page.evaluate(async ({stage}) => {
        const {getState} = await import('/src/store.js');
        const state = await getState();
        return {server:state.server.records[`teknologi:${stage}`].payload.answer, dirty:state.devices.A.records[`teknologi:${stage}`].dirty, count:Object.keys(state.server.records).length, otherDeviceCount:Object.keys(state.devices.B.records).length};
      }, {stage});
      expect(stored.server).toBe(answer); expect(stored.dirty).toBe(false); expect(stored.count).toBeLessThanOrEqual(5);
      expect(stored.otherDeviceCount).toBe(0);
      cycles++;
    }
  }
  metrics.offline = {cycles, types:5, cyclesPerType:20, lostAcknowledged:0, duplicateKeys:0, wrongDemoDevice:0, limitation:'Satu browser context, A/B simulasi, reload bukan penghentian OS atau tutup profil; bukan backend nyata.'};
});
test('Q05 mock: kegagalan tulis kuota tidak diakui berhasil dan data lama tetap', async ({page}) => {
  await ready(page);
  await page.goto('/#fenomena/teknologi/kenali');
  await page.locator('#answer').fill('Data lama terkonfirmasi lokal');
  await expect(page.locator('#local-save')).toContainText('Tersimpan di perangkat');
  await page.evaluate(() => {
    window.__oldPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function(){throw new DOMException('Kuota simulasi penuh','QuotaExceededError');};
  });
  await page.locator('#answer').fill('Data baru gagal simpan');
  await expect(page.locator('#save-status')).toContainText('Gagal menyimpan');
  await expect(page.locator('#local-save')).toContainText('Gagal menyimpan');
  await page.evaluate(() => { IDBObjectStore.prototype.put = window.__oldPut; });
  const answer = await page.evaluate(async () => (await (await import('/src/store.js')).getState()).devices.A.records['teknologi:kenali'].payload.answer);
  expect(answer).toBe('Data lama terkonfirmasi lokal');
  metrics.writeFailure = {injected:'QuotaExceededError pada IDBObjectStore.put', falseSuccess:false, previousDataIntact:true, limitation:'Fault injection; bukan kuota disk/OS penuh sungguhan.'};
});
test('Q07 mock: feedback lokal dan sinkron 100 payload teks terukur', async ({page}) => {
  await ready(page);
  await page.goto('/#fenomena/teknologi/kenali');
  const start = performance.now();
  await page.locator('#answer').fill('Umpan balik penyimpanan sintetis');
  await expect(page.locator('#local-save')).toContainText('Tersimpan di perangkat');
  const saveMs = performance.now()-start;
  expect(saveMs).toBeLessThanOrEqual(1000);
  const result = await page.evaluate(async () => {
    const {saveStage,syncDevice,getState}=await import('/src/store.js');
    for(let i=0;i<100;i++) await saveStage('A',`benchmark:${i}`,{answer:'a'.repeat(9000),done:false});
    const start=performance.now(); await syncDevice('A'); const syncMs=performance.now()-start;
    const state=await getState();
    return {syncMs,count:Object.keys(state.server.records).filter(key=>key.startsWith('benchmark:')).length};
  });
  expect(result.count).toBe(100); expect(result.syncMs).toBeLessThanOrEqual(30000);
  metrics.feedbackAndQueue = {localFeedbackMs:saveMs, localThresholdMs:1000, mockQueueCount:100, textBytesEach:9000, mockSyncMs:result.syncMs, mockThresholdMs:30000, limitation:'Tanpa RTT150ms/5Mbps/1Mbps karena tidak ada backend; bukan pengesahan performa sinkron jaringan.'};
});
test('Q08 mock: p95 navigasi aset lokal pada 30 perpindahan', async ({page}) => {
  await ready(page);
  const routes=['/#fenomena/teknologi/kenali','/#fenomena/teknologi/evaluasi','/#lab','/#karya','/#beranda'];
  const durations=[];
  for(let i=0;i<30;i++) {
    const start=performance.now(); await page.goto(routes[i%routes.length]);
    await expect(page.locator('main h1, main h2').first()).toBeVisible();
    if(i%routes.length<2) await expect(page.locator('#activity-form')).toBeVisible();
    durations.push(performance.now()-start);
  }
  durations.sort((a,b)=>a-b); const p95Ms=durations[Math.ceil(durations.length*.95)-1];
  expect(p95Ms).toBeLessThanOrEqual(2000);
  metrics.navigation={samples:30,p95Ms,thresholdMs:2000,limitation:'Desktop/headless localhost; bukan perangkat minimum, uji beban atau profil media.'};
});
