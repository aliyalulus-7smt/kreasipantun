# Acceptance targets — KREASI PANTUN

**Q01–Q10 from the PRD are approved acceptance targets.** Approval does not mean every gate has passed. The active project is `/workspace/kreasipantun`; `/workspace/kreasi-pantun` is reference-only. This evidence applies to a local frontend using synthetic data and an IndexedDB simulated server.

There is no specification conflict with the narrowed mock scope: real backend, roles, final materials, credentials, Supabase/Vercel, pushing, and deployment remain excluded. Requirements needing those capabilities stay **untested/unverified**, not silently removed or marked passed. Public-repository publication requires owner review.

Actual run counts are in `QA.md`, measured values in `gate-metrics.json`, and raw browser results in `../test-results/browser-report.json`.

## Gate mapping

| Gate | Actual mock evidence | Not run / not established | Full-product status |
|---|---|---|---|
| **Q01 — Functional coverage** | Free order; stage/phenomenon progress; save/restore; offline and conflicts; 8 phenomena and all 40 structural routes. | Only 5 routes have interactive synthetic activities; the other 35 are placeholders. Accounts/classes/teacher/admin flows and final materials are absent. | Partial, not full product acceptance. |
| **Q02 — Bug severity** | Known 360 px home overflow was fixed by clipping decorative hero artwork only; responsive regression tests cover four widths. No unresolved failures remain if the final QA suite passes. | Broad audits, other browsers/devices, and formal approval of remaining product risks are not completed. No bug-free guarantee. | Partial. |
| **Q03 — Authorization/integrity** | Transaction serialization, independent mock A/B state, conflict preservation, text-only XSS handling. Static server restricts served files. | Real authentication/authorization, classes, private file access, cross-account negative tests, and child-data protection are absent. | Unverified; real data prohibited. |
| **Q04 — Offline/sync** | 20 offline → edit → reload → online cycles for each of 5 stage types, 100 total, with assertions for restored answers, no duplicate keys, no writes to mock B, and server confirmation. Unit idempotency also tested. | Reload is not OS termination or closing/reopening a full profile. Real physical devices/server, media, OS eviction, and interrupted network send/ack are not tested. | Partial; mock-only evidence. |
| **Q05 — Conflicts/failure** | Different-activity merge; same-activity conflict; both resolution choices/archive; concurrency; fixture isolation; IDB-open rejection; injected quota write failure keeps prior data and shows failure. | Actual physical disk exhaustion, expired sessions, changed permissions, simultaneous same-field UI edits across tabs, class reset/register races. | Partial. |
| **Q06 — Responsive/accessibility** | No page overflow at 360/390/768/1366 px across home, overview, activity, and lab. Native labeled controls, focus styles, no drag-only activity. | Physical Android/iPhone/tablets, Safari/Firefox, comprehensive screen-reader/contrast/keyboard audit, all browser/route combinations. | Partial. |
| **Q07 — Feedback/sync performance** | Local-save feedback measured against ≤1 second. Mock queue of 100 × 9,000-byte text payloads measured against ≤30 seconds. Transaction success/error assertions. | No backend RTT150ms/5Mbps/1Mbps profile, physical minimum device, or large media benchmark. Local mock timings are not network sync proof. | Partial. |
| **Q08 — Navigation/capacity** | p95 across 30 locally available route changes measured against ≤2 seconds. | Login, concurrent users/classes, backend/media load, minimum-device capacity, and agreed production capacity targets. | Partial. |
| **Q09 — Recommendations/evaluation** | Synthetic self-reflection only, with no competence score or automated category. | Approved rubrics/keys/categories, pedagogical fixtures, teacher grading, separation of real teacher evaluation from student revisions. | Not tested. |
| **Q10 — Regression/recovery** | Repeatable unit/browser suites; IDB restore on reload/new page; both conflict versions archived. | External backup restoration, cross-account recovery authorization, release/rollback procedure, written release acceptance. Local restore is not backup recovery. | Partial; backup recovery not tested. |

## Decision

A passing mock suite permits **local synthetic-data demonstration only**, not production release or use with real students. The temporary completion and conflict-choice rules are not final pedagogical/policy approvals. Untested portions remain future acceptance work.
