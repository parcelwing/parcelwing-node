# Parcel Wing Node.js SDK

The official Node.js SDK for the Parcel Wing API.

It is designed for a fast, predictable developer experience:
- typed resource clients
- consistent errors
- clean pagination helpers
- zero runtime dependencies
- works with the same public API contract used by Parcel Wing itself

## Installation

```bash
npm install @parcelwing/node
```

## Quick start

First you'll need an API Key. If you don't have one, sign up and create one at https://parcelwing.com/signup. It's free, with no CC required.

```ts
import { ParcelWing } from "@parcelwing/node";

const parcelWing = new ParcelWing({
  apiKey: process.env.PARCEL_WING_API_KEY!,
});

const emails = await parcelWing.emails.send({
  from: "Acme <hello@yourdomain.com>",
  to: "person@example.com",
  subject: "Hello from Parcel Wing",
  text: "It works.",
});

console.log(emails[0]?.id);
```

## Using templates

```ts
const emails = await parcelWing.emails.send({
  from: "Acme <hello@yourdomain.com>",
  to: "person@example.com",
  template_alias: "welcome_email",
  template_params: {
    first_name: "John",
  },
});
```

## Contacts

```ts
const contact = await parcelWing.contacts.create({
  email: "person@example.com",
  first_name: "John",
  attributes: {
    plan: "pro",
  },
});

const page = await parcelWing.contacts.list({
  page: 1,
  limit: 20,
});

console.log(page.data.length, page.pagination.total);
```

## Segments

```ts
const segment = await parcelWing.segments.create({
  name: "Pro plan users",
  filter_criteria: {
    version: 1,
    match: "all",
    conditions: [
      {
        field: "attribute",
        attribute_key: "plan",
        operator: "equals",
        value: "pro",
      },
    ],
  },
});
```

## Topics

```ts
const topic = await parcelWing.topics.create({
  name: "Product Updates",
  description: "Feature launches and release notes.",
  default_subscription: "opt_in",
  visibility: "public",
});
```

## Automation events

```ts
await parcelWing.automations.track({
  event_name: "user.completed_onboarding",
  contact_id: "6d9dc8f7-c44e-4f2d-8a4e-d04f32f1744f",
  payload: {
    plan: "flight",
  },
});
```

## Error handling

```ts
import { ParcelWingError } from "@parcelwing/node";

try {
  await parcelWing.emails.send({
    from: "Acme <hello@yourdomain.com>",
    to: "person@example.com",
    subject: "Hello",
    text: "Hi there",
  });
} catch (error) {
  if (error instanceof ParcelWingError) {
    console.error(error.status, error.type, error.code, error.requestId);
    console.error(error.details);
  }
}
```

## Configuration

```ts
const parcelWing = new ParcelWing({
  apiKey: process.env.PARCEL_WING_API_KEY!,
  baseUrl: "https://parcelwing.com",
  timeoutMs: 30_000,
});
```
