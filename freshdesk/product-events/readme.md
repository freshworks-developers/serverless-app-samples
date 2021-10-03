# Product Events (ft. Freshdesk)

This app demonstrated how products events occur and can be used in Freshdesk.

## Description

Observing product events that occur in the product helps the app to get updated of the entities that get added, updated, and deleted. This event can further be piped to any other action from the app and the event payload will come handy to do so easily with the event context.

## Features demonstrated

| Event Name | Notes |
|--- | --- |
| [Product Events](https://developer.freshdesk.com/v2/docs/product-events) | Invoke JS function handlers respective to the product when the event occurs in Freshdesk |

## Prerequisites

1. Make sure you have a trial Freshdesk account created. You can always [sign up](https://freshdesk.com/signup)
2. Ensure that you have the [Freshworks CLI](https://community.developers.freshworks.com/t/what-are-the-prerequisites-to-install-the-freshworks-cli/234) installed properly.

## Procedure to run the app

```sh
# Run the app
> fdk run
# app runs on localhost:10001 and simulation page is on http://localhost:10001/web/test
```
