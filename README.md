# KREASI PANTUN — local prototype

**Working target: `/workspace/kreasipantun`**, an anonymous clone of the initially empty public repository `https://github.com/aliyalulus-7smt/kreasipantun`. `/workspace/kreasi-pantun` is only the baseline reference, not the active project.

**Do not push or deploy before owner review.** No credentials, Supabase, Vercel, real student data, or unrelated application files are used. All activities are synthetic demonstrations, not approved learning materials. The demonstration UI remains Indonesian.

## Start and preview

Requires Node.js 20+; tested with Node.js 24. There are no runtime dependencies or external fonts/CDN assets.

```bash
cd /workspace/kreasipantun
npm start
```

Open **http://localhost:4173** in the same environment. Alternative port: `PORT=4174 npm start`. The server binds `0.0.0.0` for workspace preview, not as a production deployment; do not expose it to untrusted networks. It serves only the application shell, service worker, and `src/` assets, not repository metadata or tests.

## Rerun tests

Keep the preview server running on port 4173 in another terminal:

```bash
cd /workspace/kreasipantun
npm ci
npx playwright install chromium
npm run check
npm test
npm run test:e2e
```

`npm test` runs storage unit tests. `npm run test:e2e` runs both browser suites in isolated contexts. Reports: `docs/QA.md`, `docs/ACCEPTANCE.md`, `docs/gate-metrics.json`, and `test-results/browser-report.json`.

The approved **Q01–Q10 are acceptance targets**, not automatic passes. The acceptance matrix explicitly separates mock evidence from untested product requirements.

## What works

- All eight phenomena are visible and openable. **Bijak Berteknologi** is the only interactive slice; seven others are marked placeholder/not approved and cannot be marked complete.
- All five slice stages are available in any order, including Evaluation first. Opening a stage does not mark it started or complete.
- Answers, selections, reflection, stable context, completion, versions, pending changes, and conflict archives persist in **IndexedDB**.
- Inputs autosave, with an explicit Save button. Success appears only after transaction completion; rejected writes show failure instead of a stale success message.
- Temporary demo completion rule: explicitly mark each stage complete; 5/5 complete means phenomenon complete. Reopen reverses completion. This is not an approved scoring rule; progress is not competence.
- Service-worker asset caching supports offline reload after the initial successful localhost/HTTPS load.
- Devices A/B and their server are **simulated in the same browser**. Different activities merge; conflicting versions are preserved for explicit choice and archived before resolution.
- The 360 px overflow fix clips only decorative mobile hero artwork within its container, not interactive controls or the whole page.

## Demo flows

**Free order and restore:** open Bijak Berteknologi → Evaluasi Karya first, enter a synthetic reflection, wait for local confirmation, and mark it complete. Enter a different answer in Asah Kreativitas. Reload or open another tab on the same origin; each stage restores independently.

**Offline:** check package readiness in the in-app guide after the initial online load. “Simulasikan offline” only pauses mock sync, not the OS network. Edit, wait for local confirmation, reload, then end offline simulation to trigger sync. For real browser offline reload, disable networking after the service worker takes control. First use on a new device needs access to the server.

**Conflict:** open Lab sinkronisasi → Buat contoh konflik A ↔ B. This modifies only `lab:konflik`, never the five-stage answers. Review both versions, select one, and synchronize again. Both original versions remain archived locally.

For a manual conflict: sync A's response, switch to B and sync the same base, edit the same activity independently on both, then sync A and B. B detects the conflict. For independent activities, edit Kenali on A and Kreativitas on B, then sync A → B → A.

**“Tersinkron” means confirmed by the local simulated server, not transferred to another physical device.** Browser “online” is not proof of internet/server reachability. Closed-app background sync is not implemented.

## Storage and limits

IndexedDB: `kreasi-pantun-demo-v1`, object store `state`. Asset cache: `kreasi-pantun-shell-v2`. Data is specific to the origin, browser profile, and device; changing the port changes the origin. Transactions serialize state updates.

Anyone sharing the browser profile can inspect demo data. There is no real authentication, application encryption, external backup, or recovery export. Site-data deletion, private browsing, storage pressure, or OS/browser policy may remove data. Do not enter identities, personal experiences, student work, or secrets.

To reset, clear this site's browser data; this irreversibly deletes responses, queues, and archives. During development, bump the service-worker cache version or clear only asset caches to avoid serving old source. Preserve IndexedDB to retain answers.

Not implemented: real backend/device sync, login/class codes, teacher/admin authorization, cross-account cache isolation, teacher grading, recommendation categories, validated curriculum mapping/rubrics/answers, or final content for the seven placeholders. This HTML/CSS/ES-module stack is not a final product-stack decision.

Chromium desktop tests do not prove Android/iOS/Safari/Firefox support, real quota exhaustion, backend network performance, load capacity, OS-eviction survival, backup recovery, or a full security/accessibility audit. Untested Q01–Q10 portions remain open.

## Files

`index.html` contains the shell; `src/app.js` the activities/status UI; `src/data.js` the synthetic content; `src/store.js` transactional persistence/mock sync; `src/styles.css` the responsive layout; `sw.js` offline assets; and `server.js` the restricted static server. Tests are in `tests/`; evidence and limitations are in `docs/`. `docs/CHANGED_PATHS.md` lists exact local paths for review.

PRD reference: `/workspace/PRD_Awal_KREASI_PANTUN.md` (unchanged). Technical reference: [web.dev — Offline data](https://web.dev/learn/pwa/offline-data). No third-party learning assets are bundled.
