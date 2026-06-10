# Use Cases — EventPulse Global (Serverless Sample)

**Sample repo:** [freshworks-developers/serverless-app-samples](https://github.com/freshworks-developers/serverless-app-samples)  
**Features demonstrated:** Serverless lifecycle events, `$request.invokeTemplate`, `$db.*`, multi-module product events, `renderData` error paths

## Company Overview

**EventPulse Global** runs support on **Freshdesk**, IT on **Freshservice**, chat on **Freshchat**, and voice on **Freshcaller**. Platform engineers need one reference app that shows how serverless handlers persist audit trails without an external database.

## Use Case Scenarios

### 1. Install-Time Schedule and Webhook Registration

**Scenario**: EventPulse must poll partner systems every five minutes and accept inbound webhooks after install.

**Use Case**: `onAppInstallHandler` creates a named `$schedule` job, calls `generateTargetUrl()`, stores install metadata with `$db.set`, and returns `renderData({ message })` on failure.

---

### 2. Post-Upgrade Schedule Validation

**Scenario**: After a marketplace upgrade, ops must confirm the sync schedule survived migration.

**Use Case**: `afterAppUpdateHandler` fetches the schedule by name and `$db.update`s upgrade metadata; missing schedule triggers `renderData({ message })`.

---

### 3. Ticket Create with API Probe and KV Audit

**Scenario**: When a ticket lands in Freshdesk or Freshservice, NOC wants a serverless audit entry and optional Freshdesk API verification.

**Use Case**: `onTicketCreateHandler` logs ticket id/subject/priority, then `$request.invokeTemplate('getTicket')` when iparams are configured.

---

### 4. Omnichannel Conversation and Call Logging

**Scenario**: Compliance needs one KV log for desk replies, service notes, chat messages, and caller sessions.

**Use Case**: `onConversationCreateCallback` (desk, service, chat) and `onCallCreateCallback` (`call` module / Freshcaller) append normalized entries.

---

### 5. Developer Event Monitor UI

**Scenario**: Engineers testing `fdk run` need to confirm handlers fired without reading simulator logs only.

**Use Case**: **EventPulse** (full-page + ticket sidebar) invokes `getEventLog` SMI and lists the last 50 `$db` entries.

---

## Surfaces

| Surface | File |
|---------|------|
| Event Monitor (Apps menu) | `app/index.html` + `app/scripts/app.js` |
| Ticket sidebar (desk + service) | Same view |

```sh
fdk run
```
