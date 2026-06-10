# Use Cases — FinSecure Banking

## Company Overview

**FinSecure Banking** provides retail and SMB banking on **Freshdesk** with strict **SLA** tiers for fraud, cards, and wire transfers. Operations relies on serverless automation for schedules, webhooks, lifecycle events, SMI dashboards, async jobs, and Freshcaller routing.

---

## Use Case Scenarios

### 1. Recurring SLA breach scan (scheduled events)

**Scenario:** Regulators require proof that P1 banking tickets are reviewed every 15 minutes.

**Use Case:** On install, the app registers `finsecure_sla_scan` via `$schedule.create` with a `repeat` block. **onScheduledEvent** logs each tick; agents can inspect the schedule through the `fetchScheduleDetails` SMI from the full-page app.

### 2. One-time task reminder (scheduled events)

**Scenario:** A wire-transfer review must fire once before the cutoff window.

**Use Case:** Install also creates `task_reminder` as a one-time schedule (docs-style `task_id` payload). Uninstall deletes both schedules with `$schedule.delete`.

### 3. Monitoring webhook ingestion (external events)

**Scenario:** Datadog emits alerts when API latency exceeds SLO.

**Use Case:** `generateTargetUrl()` exposes an external event URL; **onExternalEvent** receives payloads to correlate incidents with open tickets.

### 4. Bulk ticket reconciliation (jobs)

**Scenario:** Nightly import of 10k+ legacy cases must not block the agent UI.

**Use Case:** Operations triggers the `bulkTicket` job from the full-page app. `$job.updateStatusMessage` reports progress; supervisors poll status with `client.job.get` or `listJobHistory` SMI.

### 5. Agent onboarding guardrails (support_agent events)

**Scenario:** New agents in the fraud queue need distinct handling rules; group and status changes must sync to IAM.

**Use Case:** All **10** [`support_agent`](https://developers.freshworks.com/docs/app-sdk/v3.0/support_agent/serverless-apps/product-events/) events are registered: `onAgentCreate` / `Update` / `Delete`, custom status lifecycle (`onAgentStatus*`), availability changes (`onAgentAvailabilityUpdate`), and support group lifecycle (`onGroup*`).

### 6. Corporate account lifecycle (support_company events)

**Scenario:** SMB banking customers are modeled as Freshdesk companies; FinSecure audits create/update/delete.

**Use Case:** `onCompanyCreate`, `onCompanyUpdate`, and `onCompanyDelete` log company id, name, and domains.

### 7. App version migration (afterAppUpdate)

**Scenario:** FinSecure ships app updates that must re-register webhooks without blocking admins.

**Use Case:** `afterAppUpdateHandler` logs the update payload and calls `renderData()` so the new version stays active.

### 8. VIP caller routing (routing automation)

**Scenario:** High-value customers enter a multi-digit IVR code or call from a known number.

**Use Case:** Freshcaller routing automation invokes `validateUserMultipleDigits` or `validateIncomingCaller` from **actions.json**. Callbacks return `valid` / `vip` responses that branch the call flow.

### 9. Ticket lifecycle hooks (onTicket events)

**Scenario:** FinSecure must audit every ticket create, SLA-relevant update, and permanent delete for compliance.

**Use Case:** `onTicketCreate`, `onTicketUpdate`, and `onTicketDelete` handlers (per [platform docs](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/serverless-apps/product-events/onTicket/)) log ticket metadata for downstream SIEM ingestion. Agent replies continue to route via `onConversationCreate`.

### 10. Conversation thread audit (onConversation events)

**Scenario:** Compliance requires logging every reply, note edit, and ticket-linked conversation deletion.

**Use Case:** `onConversationCreate`, `onConversationUpdate`, and `onConversationDelete` handlers (per [platform docs](https://developers.freshworks.com/docs/app-sdk/v3.0/support_ticket/serverless-apps/product-events/onConversation/)) capture conversation id, ticket id, and note type for the audit trail.

### 11. Canned response governance (onCannedResponse events)

**Scenario:** FinSecure standardizes fraud-dispute macros and must track create/update/delete.

**Use Case:** `onCannedResponseCreate`, `onCannedResponseUpdate`, and `onCannedResponseDelete` log canned response id and title when agents change shared templates.

### 12. Custom field lifecycle (onTicketField events)

**Scenario:** New regulatory fields are added to the ticket form and retired after policy changes.

**Use Case:** `onTicketFieldCreate` and `onTicketFieldDelete` log field name, label, and type when admins change the ticket form schema.

### 13. Billable time tracking (onTimeEntry events)

**Scenario:** Wire-transfer investigations must reconcile agent time logs with billing exports.

**Use Case:** `onTimeEntryCreate`, `onTimeEntryUpdate`, and `onTimeEntryDelete` log time entry id, ticket id, billable flag, and duration.

### 15. Freshservice service requests (service_ticket events)

**Scenario:** IT incidents and service requests in Freshservice must sync to FinSecure’s CMDB audit log.

**Use Case:** `onTicketCreate` and `onTicketUpdate` on the [`service_ticket`](https://developers.freshworks.com/docs/app-sdk/v3.0/service_ticket/serverless-apps/product-events/onticket/) module log ticket id, status, priority, and urgency. Agent replies flow through `onConversationCreate` per [Freshservice conversation docs](https://developers.freshworks.com/docs/app-sdk/v3.0/service_ticket/serverless-apps/product-events/onconversation/).

### 16. Voice channel escalations (call events)

**Scenario:** High-value customers call the priority line; calls must open tickets and track status changes.

**Use Case:** `onCallCreate` and `onCallUpdate` under the [`call`](https://developers.freshworks.com/docs/app-sdk/v3.0/call/serverless-apps/product-events/oncall/) module capture call id, direction, and assignment for FinSecure’s CTI bridge.

### 17. Chat and messaging audit (chat_conversation events)

**Scenario:** Omni-channel fraud chat must log conversation lifecycle, every message, and agent availability.

**Use Case:** All **4** [`chat_conversation`](https://developers.freshworks.com/docs/app-sdk/v3.0/chat_conversation/serverless-apps/product-events/) events — `onConversationCreate`, `onConversationUpdate`, `onMessageCreate`, `onAgentActivityCreate` — feed the compliance audit trail.
