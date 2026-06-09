# EventPulse Serverless

Omnichannel **serverless** sample for Freshdesk, Freshservice, Freshchat, and Freshcaller. EventPulse wires lifecycle hooks, scheduled jobs, external webhooks, and product events into a shared `$db` event log with a minimal Crayons v4 dev UI.

**Platform:** 3.0 · **FDK:** 10.1.2 · **Node:** 24.11.0 · **UI:** Crayons v4

---

## What this sample demonstrates

| Capability | Where |
|------------|-------|
| `onAppInstall` / `afterAppUpdate` / `onAppUninstall` | `server/server.js` — schedule + webhook setup, `renderData` error paths |
| `onScheduledEvent` | `$request.invokeTemplate('listTickets' \| 'healthCheck')` + `$db.update` |
| `onExternalEvent` | Webhook payload logged to `$db` |
| `$request.invokeTemplate` | `config/requests.json` — `listTickets`, `getTicket`, `healthCheck` |
| `$db.set` / `get` / `update` / `delete` | Install meta + `server/lib/event-log.js` |
| `onTicketCreate` | Freshdesk + Freshservice — API probe + KV audit |
| Product events (multi-module) | Agent, company, conversation, call events |
| Dev UI | Full-page app + ticket sidebar — `getEventLog` SMI |

---

## Modules and events

| Module | Product | Events |
|--------|---------|--------|
| `common` | All | `onAppInstall`, `afterAppUpdate`, `onAppUninstall`, `onScheduledEvent`, `onExternalEvent` |
| `support_ticket` | Freshdesk | `onTicketCreate`, `onConversationCreate` |
| `service_ticket` | Freshservice | `onTicketCreate`, `onConversationCreate` |
| `support_agent` | Freshdesk | `onAgentCreate` |
| `support_company` | Freshdesk | `onCompanyCreate` |
| `chat_conversation` | Freshchat / Suite | `onConversationCreate` |
| `call` | Freshcaller / Suite | `onCallCreate` |

---

## Setup

```sh
git clone https://github.com/freshworks-developers/serverless-app-samples.git
cd serverless-app-samples
fdk validate
fdk run
```

Install with `?dev=true`, optionally set Freshdesk subdomain + API key in iparams, then open **EventPulse** from the Apps menu or ticket sidebar.

```sh
fdk pack
```

---

## Project structure

```
.
├── manifest.json
├── config/
│   ├── iparams.json
│   └── requests.json
├── server/
│   ├── server.js
│   ├── lib/event-log.js
│   └── test_data/
├── app/
│   ├── index.html
│   ├── scripts/app.js
│   └── styles/
├── README.md
└── USECASE.md
```

---

## Tech stack

- **Platform:** Freshworks Platform 3.0
- **Runtime:** Node.js 24.11.0 · FDK 10.1.2
- **Storage:** Serverless `$db` key-value
- **UI:** Crayons v4

---

## Resources

- [Serverless apps](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/)
- [Product events](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/product-events/)
- [USECASE.md](./USECASE.md)
