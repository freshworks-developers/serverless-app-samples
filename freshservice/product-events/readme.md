# Serverless Product Events for Freshservice

This app demonstrates [product events available for Freshservice](https://developers.freshservice.com/docs/product-events/) serverless apps.

## Available events

Freshservice supports 3 product events:

1. `onTicketCreate`: This event is triggered when a new ticket is created
2. `onTicketUpdate`: This event is triggered when an existing ticket is updated
3. `onConversationCreate`: This event is triggered when a note or a reply is added to an existing ticket

Additionally, `onConversationCreate` is triggered for private or public notes and replies, coming in multiple sources. They way to identify the source is to look at the value of the `data.conversation.source` property in the event payload, and [map it to the Sources](server/server.js#L1-L14) as described in the documentation.

## Setting up events

In order to receive events, serverless apps need to do 2 things:

1. Export a function from [`server/server.js`](server/server.js) that takes in a single argument for the `payload` sent by the event
2. Declare the event and its handler in [`manifest.json`](manifest.json) under [`product.freshservice.events`](manifest.json#L3-L17)

