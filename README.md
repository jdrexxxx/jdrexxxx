<img src="./assets/banner.svg?v=2" width="100%" alt="JD — founder, architect and operator at Black Wires, Miami. In production: rexvet.org, greenbits.ai, seowires.com, rexsailing.com, blackwires.com. 49.4 MB of source, 93.2% TypeScript, 1,476 contributions, 35 repositories.">

I build and run the software behind a nonprofit veterinary telehealth platform, an AI video studio, an SEO content engine, a vet marketplace and a sailing school — from Miami, Florida.

**Every repository I work in is private except this one.** A stats card here would show you an empty account: no public repos to browse, no stars, nothing to click. The green squares below are real — I have private contributions switched on — but every other number on this page was counted out of the repositories themselves, at `HEAD`, on 2026-09-09.

<img src="./assets/telemetry.svg?v=2" width="100%" alt="Telemetry: 1,474 contributions in the last year, all private. 133 active days, longest streak 21 days, peak 96 commits in one day. 49,435,195 bytes of source across 35 repositories — TypeScript 93.20%, JavaScript 2.59%, Astro 2.55%, CSS 0.86%, HTML 0.61%, nine others 0.19%.">

---

### Greenbits — [greenbits.ai](https://greenbits.ai)

A cinematic AI generation studio: text-to-video, image, motion transfer, lipsync. Four months old, and **92 of its 93 commits are mine.**

- **60 models from 5 inference providers behind one typed API.** The registry is a 1,195-line file where every entry declares its provider, credit price, aspect-ratio encoding, duration type and reference-image parameter — because fal, Segmind, MUAPI, OpenAI and Vertex all disagree on schema, and a wrong type is a hard rejection, not a warning.
- **The whole studio is also an MCP server** — JSON-RPC 2.0 at `/api/mcp`, protocol `2025-06-18`, 12 tools. Claude Desktop or Cursor can generate with a Bearer key and bill through the same pipeline as the web UI.
- **Credits are held before submit**, atomically, as a conditional `findOneAndUpdate` on `credits >= cost`, and auto-refunded from the provider webhook on error, missing output, or any failure.
- **A margin console at `/admin/costs`** over a 51-entry per-model cost table with real per-second provider pricing, so the credit price of any model can be checked against the invoice.
- Docker → CodeBuild → ECR → App Runner. First-touch attribution captured in middleware before any JS runs, storing `gclid` plus `wbraid`/`gbraid` in a 90-day cookie so paid clicks still join back to the Ads report.

### Rex Vets — [rexvet.org](https://rexvet.org)

A US 501(c)(3) nonprofit veterinary telehealth org. EIN 33-2469898, tax-exempt since January 2025. I founded it, I architect it and I operate it — **a team of five writes the patient app; the marketing site is mine, 239 of its 316 commits.**

- **The marketing site is a programmatic SEO engine**: 135 Astro pages generated from 20 typed data modules — 89 US cities, 48 breed-condition sets, 35 medications, 26 dosage guides — plus 188 maintained redirects, 68 long-form articles in one typed content file, and a build step that repairs its own sitemap by pulling published slugs from the app's API.
- **The patient app runs 344 API route handlers** and 150 page routes over 64 Mongoose models across 1,623 tracked files — 51 admin, 44 appointments, 22 support-chat, 18 mobile, 16 veterinarian.
- **Live consults on Agora** with server-minted tokens, cloud recording to S3 that is lifecycle-deleted per channel, and an admin dashboard that monitors calls in flight.
- **Prescriptions fax to pharmacies through Phaxio**, behind a `FAX_ENABLED` kill switch, with a webhook status callback and a collection that audits every attempt.
- **Mobile is bare React Native 0.85, not Expo**: 1,333 commits, 487 TypeScript files, three role-based navigator trees in one binary across five server roles, 55 RTK Query slices, and hand-written Kotlin and Swift mixed-audio call recorders.

### SEO Wires — [seowires.com](https://seowires.com)

Credit-metered AI SEO SaaS: crawl a site, mine SERP and Google Ads keyword data, then research, outline, write, illustrate, internally link and publish articles into WordPress on a schedule. **One engineer writes it. I own the product, set the pricing model and merge the PRs — 31 of its 198 commits are mine.**

- **The article pipeline is an actual finite state machine** — `topic → research → outline → writing → done`, with a five-step research sub-state and an `InvalidTransitionError` guard that refuses illegal moves out of terminal states.
- **Internal linking is not prompt-and-pray.** The model proposes anchors; a deterministic applier validates each against 13 named skip reasons — `inside_heading`, `ambiguous_context`, `overlapping_snippet`, `duplicate_target`, `hard_max_exceeded` — before it may touch the HTML.
- **Double-entry credit ledger.** `debit()` is a single conditional update, so it cannot go negative under concurrency; debit and refund are idempotent through a unique key that rolls back on duplicate; every row records `balanceAfter`.
- **34 documented public endpoints** in 10 groups, key-authenticated, with per-endpoint credit costs declared in the spec. 87 route handlers, 18 models, 152 target locales, 5 workers across 4 BullMQ queues.

### Talk to a Vet

Empty repo to a working vet Q&A marketplace in **11 commits, all mine, in one day**: Next.js 16, 31 API routes, 20 Prisma models, Stripe billing, Ably chat, an Anthropic-backed intake assistant, 3 cron jobs. Built and pushed — not launched, no customers.

The interesting part is that the law is compiled in rather than filed in a policy PDF. `eligibility.ts` encodes state-by-state veterinary practice rules — 4 blocked states, 3 requiring an in-state licence — with the statute cited beside each. Consent records and payout ledger entries are append-only by design. Emergency triage runs *before* the paywall behind a deterministic red-flag backstop, so an LLM outage cannot silently switch triage off, and a flagged case is never billed.

<details>
<summary><b>The rest of the estate</b></summary>

<br>

**Rex Sailing School** — [rexsailing.com](https://rexsailing.com), on the Basque coast.
**Black Wires** — [blackwires.com](https://blackwires.com), the studio all of this ships under.

Plus, in the private tree: Pawllicy, Vet Formed, Cubazo Marketplace, Dennis Beach Club, Rex Marine Cargo, RexBone, two storefronts, a Chrome recording extension, and a pile of Tampermonkey userscripts that exist because a browser would not do what I wanted.

</details>

---

### Stack

**Language** — TypeScript, 93.2% of everything above, with Kotlin, Swift and Objective-C where React Native needed a native module written by hand.
**Web** — Next.js 15/16 App Router, React 19, Astro 5, Tailwind, Radix.
**Mobile** — bare React Native 0.85, Redux Toolkit + RTK Query, Agora, Firebase Cloud Messaging.
**Data** — MongoDB/Mongoose, Prisma on Postgres, Redis + BullMQ.
**AI** — Anthropic Claude, MCP servers, fal.ai, OpenAI, Google Vertex, OpenRouter.
**Infra** — Docker, AWS App Runner + ECR + CodeBuild, S3 + CloudFront, Coolify, Vercel, Dokploy.
**Money and growth** — Stripe billing with credit ledgers, Google Ads + GTM, Serper, Sentry, PostHog.

<details>
<summary><b>Where these numbers come from</b></summary>

<br>

| Figure | Counted from |
| --- | --- |
| 49,435,195 bytes · 93.20% TypeScript · 35 repositories | GitHub Languages API, summed across every repo this account can reach, private included |
| 1,476 contributions since June 2024 — 1,474 of them in the last year, over 133 active days; 21-day streak; 96-commit day | the account contribution calendar, private contributions included |
| routes, components, models, pages | counted in the source trees at `HEAD` on 2026-09-09 |
| commit splits | the GitHub contributors API, per repo |

Commit totals are repo-wide and include collaborators; wherever a repo is not mine alone I have printed my share of it next to the name. Nothing here is weighted to flatter me — the largest codebase on this page is the one I have written the least of.

**There are no user, revenue, traffic, download or uptime numbers on this page.** Not because they would be unflattering, but because I cannot verify them from source, and a dashboard that prints unverifiable numbers is decoration.

</details>

```
$ whoami
JD  ·  @jdrexxxx  ·  Black Wires
Miami, FL, USA  ·  EST/EDT
TypeScript 93.2%  ·  49.4 MB  ·  35 private repositories, plus this page
Reachable at blackwires.com
```
