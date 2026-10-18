# Local prototype QA — verified baseline

**Active target:** `/workspace/kreasipantun`. Tests were rerun here against the server launched from this clone, not merely inherited from `/workspace/kreasi-pantun`.

## Result

- `npm ci --no-audit --no-fund`: succeeded from the committed-format lockfile (the local repository itself has no commits yet).
- `npm run check`: passed syntax checks for the application, store, server, and service worker.
- `npm test`: **8 passed, 0 failed, 0 skipped**.
- `npx playwright test --workers=1` (equivalent to `npm run test:e2e`): **16 passed, 0 failed, 0 skipped**, in 33.9 seconds.
- Preview health check: `/` returned HTTP 200. `/.git/config`, `/README.md`, and `/tests/prototype.spec.js` returned 404; `/src/app.js` returned 200.

Environment: Node.js v24.19.0, Playwright 1.64.1 bundled Chromium, fake-indexeddb 6.2.6, one worker and a fresh browser context per browser test. No real backend or physical mobile device was involved.

Raw browser results: `../test-results/browser-report.json`. Local run log: `browser-test-run.log` (generated/ignored, not required to be published). Reproducible numerical evidence: `gate-metrics.json`.

## Resolved 360 px issue

An earlier reference-baseline run detected home overflow at 360 px caused by decorative hero artwork extending beyond its container. The fix in `src/styles.css` applies `overflow:hidden` only to `.page-top` within the mobile media query. It does not suppress overflow on `body`/`html` or hide interactive controls.

Final regression passed at **360, 390, 768, and 1366 px** on home, phenomenon overview, activity, and lab routes. The prior 11/12 result and old `prototype-report.json` filename are superseded by this final record. There are no unresolved failures in the executed suite; this is not a claim that no other bugs exist.

## What actually ran

- Eight cards: one interactive slice and seven explicit placeholders.
- All 40 phenomenon/stage combinations open freely; 35 placeholder combinations have no completion form.
- Evaluation first without prerequisites; five-stage save/complete/reopen and 5/5 phenomenon progress.
- IndexedDB restoration after reload and opening another page in the same context.
- Simulated offline pending state and reconnection; actual browser-network offline warm-cache reload.
- **100 offline cycles:** 20 edit → reload → reconnect cycles for each of five stage types. Assertions found no acknowledged answer loss, duplicate server keys, or writes to mock device B.
- Different-activity merge, same-activity conflicts, preservation/archive, both resolution choices, idempotent retry, and concurrent storage transactions.
- Lab fixture isolation: it does not replace or synchronize the learner slice inadvertently.
- IndexedDB-open failure and injected `QuotaExceededError` on write; both global and local messages show failure, and previously committed data remains intact.
- XSS-shaped input remains text rather than executable HTML.
- Local-save feedback, 100 × 9,000-byte mock sync queue, and p95 from 30 local route changes met the mock thresholds. Actual timings are in `gate-metrics.json`; they are not network/backend benchmarks.

## Acceptance limits and review

Q01–Q10 are approved targets; see `ACCEPTANCE.md` for all untested portions. No full-product gate pass is claimed. Authentication/authorization, real devices/server, final teaching materials, teacher grading/recommendations, real disk exhaustion/OS eviction, full accessibility/security audits, production load/network profile, and backup recovery remain unverified or unimplemented.

A read-only local review found no credentials/environment files, external runtime service configuration, or runtime CDN dependencies in the intended project files. Test dependencies use the npm registry only at installation. The static server serves the current intended assets; future files added under `src/` would also be served, so secrets or private files must never be put there.

**Decision:** executable and rerunnable for local synthetic-data demonstration. No blocker to that baseline. Public publication is intentionally held for owner review; no commit, push, deployment, Supabase, Vercel, or credential use occurred. All intended files are new/untracked in the empty clone. This is not production or real-student-data approval.
