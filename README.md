## Serverless App Sample

This samples repository consists of exampls and samples of using Serverless app that uses the features of [App Setup events](https://freshworks.dev/docs/app-sdk/v3.0/common/serverless-apps/app-set-up-events/), [Scheduled events](https://freshworks.dev/docs/app-sdk/v3.0/common/serverless-apps/scheduled-events/), [External events](https://freshworks.dev/docs/app-sdk/v3.0/common/serverless-apps/external-events/) and also different Product events that are supported in different modules -

| Module | Works in Product | Serverless event |
| ----- | ------- | ------- |
| `common` | App setup - common across all products | `onAppInstall` `onAppUninstall` |
| `common` | Scheduled events - common across all products | `onScheduledEvent` |
| `common` | External events - common across all products | `onExternalEvent` |
| `support_agent` | Freshdesk | `onAgentCreate` |
| `support_company` | Freshdesk | `onCompanyCreateCallback` |
| `chat_conversation` | Freshchat, Freshsales Suite (Freshsales classic, Freshchat and Freshcaller / only Freshchat / only Freshcaller / only Freshsales classic) | `onConversationCreate` |
| `caller_conversation` | Freshcaller, Freshsales Suite (Freshsales classic, Freshchat and Freshcaller / only Freshcaller) | `onCallCreateCallback` |


### Event payload sample

```
{
  "currentHost": {
    "subscribed_modules": [ "value1", "value2" ],
    "endpoint_urls": {
      "<product_name>": "value"
      }
  },
  "data": {
   //Contains the list of objects related to the event.
  },
  "event": "value",
  "iparams": {
    "Param1": "value",
    "Param2": "value"
  },
  "region": "value",
  "timestamp": "value"
}
```