# FinSecure Serverless App Samples

Global Freshworks **Platform 3.0** reference app covering every documented serverless pattern and **all product events** across six modules. Event simulation runs entirely through the FDK test UI — no product UI required for product-event testing.

![Serverless App — simulate all events at localhost:10001/web/test](serverless-banner.png)

| | |
|---|---|
| **Platform** | 3.0 global app |
| **Primary surface** | Event simulator at [http://localhost:10001/web/test](http://localhost:10001/web/test) |
| **Optional surface** | `full_page_app` (SMI + Jobs demo) |
| **Node** | 24.11.1 |
| **FDK** | 10.1.2 |

---

## What it does

This sample registers **every serverless event** documented for the modules below, with matching handlers in [`server/server.js`](server/server.js) and simulation payloads in [`server/test_data/`](server/test_data/).

Use it to:

1. **Simulate events locally** — pick a module and event at `/web/test`, click **Simulate**, read `[FinSecure]` logs in the `fdk run` terminal.
2. **Learn serverless patterns** — SMI, Jobs, scheduled events, external events, and Freshcaller routing automation.
3. **Validate manifest wiring** — `fdk validate` + `npm test` assert every event, handler, and payload file.

Business context for the FinSecure Banking story: [usecase.md](./usecase.md).

---

## Features

### Serverless patterns

| Pattern | Where | Docs |
|---------|-------|------|
| **App set-up events** | `onAppInstall`, `afterAppUpdate`, `onAppUninstall` | [App set-up](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/app-set-up-events/) |
| **Scheduled events** | `$schedule.create/fetch/update/delete` on install + SMI | [Scheduled events](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/scheduled-events/) |
| **External events** | `generateTargetUrl()` + `onExternalEvent` | [External events](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/external-events/) |
| **Server method invocation (SMI)** | 5 functions + full-page demo UI | [SMI](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/server-method-invocation/) |
| **Jobs** | `bulkTicket` job + `$job.get/history` | [Jobs](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/jobs/) |
| **Routing automation** | `actions.json` Freshcaller IVR callbacks | [Routing automation](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/routing-automation/) |

### Product events (41 registrations)

| Module | Events | Count |
|--------|--------|-------|
| **Common** | `onAppInstall`, `afterAppUpdate`, `onAppUninstall`, `onScheduledEvent`, `onExternalEvent` | 5 |
| **Support agent** | `onAgent*`, `onAgentStatus*`, `onAgentAvailabilityUpdate`, `onGroup*` | 10 |
| **Support company** | `onCompanyCreate`, `onCompanyUpdate`, `onCompanyDelete` | 3 |
| **Support ticket** | `onTicket*`, `onConversation*`, `onCannedResponse*`, `onTicketField*`, `onTimeEntry*` | 14 |
| **Service ticket** | `onTicketCreate`, `onTicketUpdate`, `onConversationCreate` | 3 |
| **Chat conversation** | `onConversation*`, `onMessageCreate`, `onAgentActivityCreate` | 4 |
| **Call** | `onCallCreate`, `onCallUpdate` | 2 |

---

## Prerequisites

| Requirement | Link |
|-------------|------|
| **Node.js 24.x** | [nodejs.org](https://nodejs.org/) |
| **FDK 10.1.2** | [Freshworks CLI setup](https://developers.freshworks.com/docs/app-sdk/v3.0/common/freshworks-cli-setup/) |
| **Chrome (latest)** | Required for FDK event simulation |
| **Dev account** | Freshdesk, Freshservice, and/or Freshcaller depending on modules tested |

Enable global apps before validating:

```bash
fdk config set global_apps.enabled true
```

---

## Step 1 — Install and validate

```bash
cd usecase+migration/serverless-app-samples
npm install
fdk validate
npm test
```

Expected: **0 platform errors** from `fdk validate`; **49** unit tests pass.

---

## Step 2 — Run locally

```bash
fdk run
```

| URL | Purpose |
|-----|---------|
| [http://localhost:10001/system_settings](http://localhost:10001/system_settings) | Select modules + account URLs |
| [http://localhost:10001/custom_configs](http://localhost:10001/custom_configs) | Install the app (triggers `onAppInstall`) |
| [http://localhost:10001/web/test](http://localhost:10001/web/test) | **Simulate events and routing actions** |

Docs: [Test your app](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/basic-dev-tools/freshworks-cli-setup/test-your-app/)

---

## Step 3 — Configure system settings

On [system settings](http://localhost:10001/system_settings):

1. **Select the modules to test** — check all six product modules:

   - `support_agent`
   - `support_company`
   - `support_ticket`
   - `service_ticket`
   - `chat_conversation`
   - `call`

2. Enter account URLs for each selected module (e.g. `https://<domain>.freshdesk.com`).

3. For **Service ticket**, choose product type **ITSM** or **MSP** and enter your Freshservice URL.

4. Click **Continue**, then install at [custom configs](http://localhost:10001/custom_configs).

**Subscribed modules** after install: `support_ticket`, `support_company`, `support_agent`, `call`, `service_ticket`, `chat_conversation`.

**Simulation compatibility:** Freshdesk · Freshsales · Freshsales Suite · Freshdesk Contact Center · Freshchat · Freshservice · Freshmarketer

> Restart `fdk run` after changing `manifest.json` so new events appear in the dropdown.

---

## Step 4 — Simulate serverless events

Open [http://localhost:10001/web/test](http://localhost:10001/web/test).

1. **Select type:** `events`
2. **Select module** from the dropdown (only modules registered in `manifest.json` and selected in system settings appear)
3. **Select an event** — the payload auto-loads from [`server/test_data/<module>/`](server/test_data/)
4. Click **Simulate** — button shows **Success** when the handler runs
5. Check the `fdk run` terminal for `[FinSecure] <eventName>` log lines

### Common module (5 events)

| Event | Handler | Test payload |
|-------|---------|--------------|
| `onAppInstall` | `onAppInstallHandler` | [`common/onAppInstall.json`](server/test_data/common/onAppInstall.json) |
| `afterAppUpdate` | `afterAppUpdateHandler` | [`common/afterAppUpdate.json`](server/test_data/common/afterAppUpdate.json) |
| `onAppUninstall` | `onAppUninstallHandler` | [`common/onAppUninstall.json`](server/test_data/common/onAppUninstall.json) |
| `onScheduledEvent` | `onScheduledEventHandler` | [`common/onScheduledEvent.json`](server/test_data/common/onScheduledEvent.json) |
| `onExternalEvent` | `onExternalEventHandler` | [`common/onExternalEvent.json`](server/test_data/common/onExternalEvent.json) |

`onAppInstall` creates two schedules (`$schedule.create`) and an external-event URL (`generateTargetUrl()`). `onAppUninstall` deletes both schedules.

### Support agent module (10 events)

| Group | Events |
|-------|--------|
| **onAgent** | `onAgentCreate`, `onAgentUpdate`, `onAgentDelete` |
| **onAgentStatus** | `onAgentStatusCreate`, `onAgentStatusUpdate`, `onAgentStatusDelete` |
| **onAgentAvailability** | `onAgentAvailabilityUpdate` |
| **onGroup** | `onGroupCreate`, `onGroupUpdate`, `onGroupDelete` |

Payloads: [`server/test_data/support_agent/`](server/test_data/support_agent/) · Docs: [onAgent](https://developers.freshworks.com/docs/app-sdk/v3.0/support_agent/serverless-apps/product-events/onAgent/) · [onAgentStatus](https://developers.freshworks.com/docs/app-sdk/v3.0/support_agent/serverless-apps/product-events/onAgentStatus/) · [onAgentAvailabilityUpdate](https://developers.freshworks.com/docs/app-sdk/v3.0/support_agent/serverless-apps/product-events/onagentavailability/) · [onGroup](https://developers.freshworks.com/docs/app-sdk/v3.0/support_agent/serverless-apps/product-events/onGroup/)

### Support company module (3 events)

`onCompanyCreate` · `onCompanyUpdate` · `onCompanyDelete`

Payloads: [`server/test_data/support_company/`](server/test_data/support_company/) · Docs: [onCompany](https://developers.freshworks.com/docs/app-sdk/v3.0/support_company/serverless-apps/product-events/onCompany/)

### Support ticket module (14 events)

| Group | Events |
|-------|--------|
| **onTicket** | `onTicketCreate`, `onTicketUpdate`, `onTicketDelete` |
| **onConversation** | `onConversationCreate`, `onConversationUpdate`, `onConversationDelete` |
| **onCannedResponse** | `onCannedResponseCreate`, `onCannedResponseUpdate`, `onCannedResponseDelete` |
| **onTicketField** | `onTicketFieldCreate`, `onTicketFieldDelete` |
| **onTimeEntry** | `onTimeEntryCreate`, `onTimeEntryUpdate`, `onTimeEntryDelete` |

Payloads: [`server/test_data/support_ticket/`](server/test_data/support_ticket/) · Docs: [Product events](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/serverless-apps/product-events/)

> `onTicketUpdate` is **not** fired when an agent replies — those trigger `onConversationCreate` / `onConversationUpdate`.

### Service ticket module (3 events)

`onTicketCreate` · `onTicketUpdate` · `onConversationCreate`

Payloads: [`server/test_data/service_ticket/`](server/test_data/service_ticket/) · Docs: [onTicket](https://developers.freshworks.com/docs/app-sdk/v3.0/service_ticket/serverless-apps/product-events/onticket/) · [onConversation](https://developers.freshworks.com/docs/app-sdk/v3.0/service_ticket/serverless-apps/product-events/onconversation/)

Freshservice payloads include ITSM fields such as `urgency` (tickets) and `ticket_workspace_id` (conversations).

### Chat conversation module (4 events)

`onConversationCreate` · `onConversationUpdate` · `onMessageCreate` · `onAgentActivityCreate`

Payloads: [`server/test_data/chat_conversation/`](server/test_data/chat_conversation/) · Docs: [onConversation](https://developers.freshworks.com/docs/app-sdk/v3.0/chat_conversation/serverless-apps/product-events/onconversation/) · [onMessageCreate](https://developers.freshworks.com/docs/app-sdk/v3.0/chat_conversation/serverless-apps/product-events/onmessage/) · [onAgentActivityCreate](https://developers.freshworks.com/docs/app-sdk/v3.0/chat_conversation/serverless-apps/product-events/onagentactivity/)

> Chat `onConversation*` handlers (`onChatConversation*Callback`) are separate from Freshdesk ticket conversation handlers because payloads differ.

### Call module (2 events)

`onCallCreate` · `onCallUpdate`

Payloads: [`server/test_data/call/`](server/test_data/call/) · Docs: [onCall](https://developers.freshworks.com/docs/app-sdk/v3.0/call/serverless-apps/product-events/oncall/)

> Local simulation does not mutate real product data. Publish as a custom app to verify live triggers.

---

## Step 5 — Test routing automation actions (Freshcaller)

1. Open [http://localhost:10001/web/test](http://localhost:10001/web/test).
2. **Select type:** `actions`.
3. Choose **validateUserMultipleDigits** or **validateIncomingCaller**.
4. Edit the payload if needed (defaults in [`server/test_data/actions/`](server/test_data/actions/)).
5. Click **Simulate** — expect **Success** when `renderData(null, { data: { response: … } })` returns.

| Input | Expected response |
|-------|-------------------|
| `{ "input": "11" }` | `response: "valid"` (VIP IVR code) |
| `{ "input": "+15551234567" }` | `response: "vip"` with `app_variables.caller_type` |

Docs: [Routing automation](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/routing-automation/)

---

## Step 6 — Test SMI and Jobs (optional full-page app)

The app includes a **full-page demo UI** for SMI and Jobs — not required for event simulation.

1. With `fdk run` active, open Freshdesk dev mode: `https://<your-domain>.freshdesk.com/a/?dev=true`
2. Launch **FinSecure Serverless Demo** from the Apps menu.
3. Use the dashboard buttons:

| Button | API |
|--------|-----|
| **Invoke smiEcho** | `client.request.invoke('smiEcho', …)` |
| **Fetch schedule** | `fetchScheduleDetails` → `$schedule.fetch` |
| **Update schedule** | `updateScheduleDemo` → `$schedule.update` |
| **Run bulkTicket job** | `client.job.invoke('bulkTicket', tag, options)` |
| **Poll latest job** | `client.job.get(jobId)` |
| **List job history** | `listJobHistory` → `$job.history` |

> Jobs are [not supported for Freshdesk-related modules](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/jobs/) in production. This sample declares jobs under `common` and exercises them from the full-page app.

---

## Implementation reference

### SMI functions (`modules.common.functions`)

`smiEcho` · `fetchScheduleDetails` · `updateScheduleDemo` · `getJobDetails` · `listJobHistory`

### Jobs (`modules.common.jobs`)

`bulkTicket` — uses `$job.updateStatusMessage()` for progress; no `renderData`.

### Scheduled events (install lifecycle)

| Schedule | Type | Purpose |
|----------|------|---------|
| `finsecure_sla_scan` | Recurring (15 min) | SLA breach scan tick |
| `task_reminder` | One-time | Docs-style `task_id` reminder |

### Key platform APIs

| API | Where used |
|-----|------------|
| `$schedule.create` | `onAppInstallHandler` |
| `$schedule.fetch` / `$schedule.update` | SMI helpers |
| `$schedule.delete` | `onAppUninstallHandler` |
| `generateTargetUrl` | `onAppInstallHandler` |
| `renderData` | SMI, app set-up, routing actions |
| `$job.updateStatusMessage` | `bulkTicket` job |
| `client.request.invoke` / `client.job.invoke` | `app/scripts/app.js` |

---

## Folder structure

```text
serverless-app-samples/
├── serverless-banner.png          # Event simulator overview (this README)
├── actions.json                   # Freshcaller routing automation
├── manifest.json                  # All modules, events, SMI, jobs
├── app/
│   ├── index.html                 # Optional full-page SMI + Jobs demo
│   ├── scripts/app.js
│   ├── styles/style.css
│   └── icon.svg
├── server/
│   ├── server.js                  # All serverless handlers
│   ├── lib/handle-response.js
│   └── test_data/                 # One JSON payload per event
│       ├── common/
│       ├── support_agent/
│       ├── support_company/
│       ├── support_ticket/
│       ├── service_ticket/
│       ├── chat_conversation/
│       ├── call/
│       └── actions/
├── config/iparams.json            # Empty — no install fields
├── tests/server.test.js
├── usecase.md
└── README.md
```

---

## Development commands

```bash
fdk validate     # Platform + lint check
fdk run          # Local dev server (port 10001)
npm test         # Vitest unit tests (49 tests)
fdk pack         # Submission package
```

---

## Troubleshooting

### Event missing from dropdown

- Confirm the module is checked on [system settings](http://localhost:10001/system_settings).
- Restart `fdk run` after `manifest.json` changes.

### Simulate shows Failed

- Edit the payload JSON — invalid data causes simulation failure.
- Match handler names exactly between `manifest.json` and `server/server.js`.

### SMI returns “Requested function not found or registered”

- Function name must match between `manifest.json` → `modules.common.functions` and `server/server.js`.
- Restart `fdk run` after manifest changes.

### Scheduled event simulation shows Success but no backend data

- Local simulation does not create real schedules in production. Use `onAppInstall` during `fdk run` for `$schedule.create`, or publish as a custom app.

### Routing action simulation fails

- Ensure `actions.json` callback names match `server/server.js` exports.
- Payload must include `"input"` string per `actions.json` schema.

---

## Related docs

- [Serverless apps overview](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/)
- [App set-up events](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/app-set-up-events/)
- [Scheduled events](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/scheduled-events/)
- [External events](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/external-events/)
- [Server method invocation](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/server-method-invocation/)
- [Configure jobs](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/jobs/)
- [Routing automation](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/routing-automation/)
- [Support ticket product events](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/serverless-apps/product-events/)
- [Service ticket product events](https://developers.freshworks.com/docs/app-sdk/v3.0/service_ticket/serverless-apps/product-events/)
- [Support agent product events](https://developers.freshworks.com/docs/app-sdk/v3.0/support_agent/serverless-apps/product-events/)
- [Support company product events](https://developers.freshworks.com/docs/app-sdk/v3.0/support_company/serverless-apps/product-events/)
- [Chat conversation product events](https://developers.freshworks.com/docs/app-sdk/v3.0/chat_conversation/serverless-apps/product-events/)
- [Call product events](https://developers.freshworks.com/docs/app-sdk/v3.0/call/serverless-apps/product-events/)
- [Rate limits and constraints](https://developers.freshworks.com/docs/app-sdk/v3.0/common/rate-limits-and-constraints/)

See also [usecase.md](./usecase.md) for FinSecure business scenarios.
