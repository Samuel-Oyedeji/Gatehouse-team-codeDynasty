<img src="apps/frontend/src/assets/gatehouse-mark.jpeg" alt="Gatehouse" width="72" />

# Gatehouse — Architecture & Security Notes

**Nomba Hackathon 2026 · Team Code Dynasty**

> Live API docs: [https://gatehouse-team-codedynasty-production.up.railway.app/api/docs](https://gatehouse-team-codedynasty-production.up.railway.app/api/docs)

---

## Architecture Overview

```
Browser / Mobile
      │
      ▼
 TanStack Start (React, Vercel)
      │  REST + SSE
      ▼
 NestJS API (Railway)
      │
      ├── Prisma 6 ──► PostgreSQL
      └── Nomba API ──► Virtual accounts · Payouts · Webhooks
```

- The **frontend** is a single-page React application deployed on Vercel.
- The **backend** is a NestJS monolith deployed on Railway, serving REST endpoints and a Server-Sent Events stream.
- **Nomba** provides the financial rails: virtual account numbers per unit, inbound payment webhooks, and outbound payouts to vendors.
- **No funds ever touch Gatehouse servers.** Money flows directly into the estate's Nomba sub-account. Gatehouse is the ledger.

---

## Authentication

### Manager Auth (JWT + bcrypt)

- Passwords are hashed with **bcrypt at cost factor 10** before storage. Plain-text passwords are never persisted.
- On login/register, the server issues a **signed JWT** (HS256). The client must include it as `Authorization: Bearer <token>` on every protected request.
- All protected routes are guarded by `JwtAuthGuard`. No route is accidentally left open — NestJS's guard system applies at the controller or route level.
- `POST /auth/logout` is a client-side invalidation signal only. Because JWTs are stateless, the client is responsible for discarding the token. Proper blocklisting is outside hackathon scope.
- The `GET /auth/me` endpoint binds the token's `managerId` claim to the current session; the `@CurrentManager()` decorator extracts this on every guarded request.

### SSE Stream Tickets (short-lived scoped tokens)

The browser's `EventSource` API cannot send `Authorization` headers. Putting a long-lived JWT in a URL query string leaks it into server logs, proxy history, and browser history. Gatehouse solves this with a two-step approach:

1. `GET /stream/ticket` — the client calls this with its normal Bearer token. The server mints a **60-second, stream-scoped JWT** (`{ scope: "stream" }`).
2. The client opens `GET /stream?token=<ticket>&estateId=<id>` using the short-lived ticket.
3. On the SSE endpoint, the server verifies the ticket **and** checks that `scope === "stream"`. A leaked long-lived API token cannot be used here.

---

## Webhook Security

### Nomba Signature Verification (HmacSHA256)

The `POST /webhooks/nomba` endpoint is **intentionally public** (no JWT — Nomba cannot authenticate as a manager). It is protected instead by **HmacSHA256 request signing**:

1. Nomba signs a colon-joined string of key transaction fields using a shared secret configured in the Nomba dashboard:

```
event_type:requestId:userId:walletId:transactionId:type:time:responseCode:nomba-timestamp
```

2. The server recomputes the expected HMAC using the same key and **compares with `timingSafeEqual`** to prevent timing-side-channel attacks.
3. Any request that fails signature verification is rejected with `401 Unauthorized` before any database work is done.
4. The endpoint is excluded from Swagger docs (`@ApiExcludeEndpoint`) so it does not appear as a callable surface in the public API explorer.

### Idempotency

Payment ingestion is **idempotent on `transactionId`**. If Nomba redelivers a webhook (e.g. after a 500 response), the same payment cannot be double-credited. The `transactionId` is stored as a unique key on the payments ledger.

### Event Dispatch

The webhook handles four event types and drops everything else cleanly:

| Event | Action |
|---|---|
| `payment_success` | Ingest payment → run reconciliation engine → broadcast SSE |
| `payment_reversal` | Reverse the original payment by ref |
| `payout_success` | Mark payout `SUCCESS` in DB |
| `payout_failed` | Mark payout `FAILED` in DB |
| `payout_refund` | Mark payout `REVERSED` in DB |
| anything else | Logged and dropped — no retry loop |

---

## Data Handling

### Input Validation

NestJS `ValidationPipe` is applied globally with:

- **`whitelist: true`** — unknown fields are silently stripped before they reach a handler.
- **`forbidNonWhitelisted: true`** — requests with unknown fields throw `400 Bad Request`.
- **`transform: true`** — payloads are auto-transformed to typed DTO classes, preventing type coercion bugs.

### Money

All monetary values are stored internally in **kobo** (integer) to avoid floating-point rounding errors. The frontend converts to naira only for display. The API accepts naira (for human ergonomics) and converts before persistence via `nairaToKobo()`.

### Soft Deletes

Units and vendors are **soft-deleted** (a `deletedAt` timestamp is set). No financial records are ever hard-deleted, preserving audit trails.

### ORM

All database access goes through **Prisma 6**. There are no raw SQL queries. Prisma's parameterized queries prevent SQL injection by construction.

### CORS

The API enables CORS for all origins (`*`) during the hackathon period. In production, this should be locked to the Vercel deployment domain.

---

## API Endpoints

> Full interactive docs with request/response schemas: **[https://gatehouse-team-codedynasty-production.up.railway.app/api/docs](https://gatehouse-team-codedynasty-production.up.railway.app/api/docs)**

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register a new estate manager |
| `POST` | `/auth/login` | — | Log in, receive JWT |
| `POST` | `/auth/logout` | JWT | Signal logout (client discards token) |
| `GET` | `/auth/me` | JWT | Current manager + their estates |

### Onboarding (4-step flow)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/onboarding/state` | JWT | Resume onboarding after a page refresh |
| `POST` | `/onboarding/estate` | JWT | Step 1 — Create the estate profile |
| `POST` | `/onboarding/connect-nomba-account` | JWT | Step 2 — Fetch and cache Nomba API token |
| `POST` | `/onboarding/fee` | JWT | Step 3 — Set service charge and levies |
| `POST` | `/onboarding/unit` | JWT | Step 4 — Bulk-upload units (CSV or JSON array), generate virtual accounts |

### Estate State & Settings

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/estate/:id/state` | JWT | Full estate view-model — dashboard, units, payments, exceptions |
| `PATCH` | `/estate/:id` | JWT | Update estate name, address, allocation rule, auto-credit threshold |

### Units

| Method | Path | Auth | Description |
|---|---|---|---|
| `PATCH` | `/estate/:estateId/units/:unitId` | JWT | Update a unit's resident contact (email / phone) |
| `DELETE` | `/estate/:estateId/units/:unitId` | JWT | Soft-delete a unit |

### Unit Groups

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/estate/:estateId/groups` | JWT | Create a unit group (e.g. Block A) |
| `DELETE` | `/estate/:estateId/groups/:groupId` | JWT | Delete a group (units become ungrouped) |
| `PATCH` | `/estate/:estateId/units/:unitId/group` | JWT | Assign or remove a unit from a group |

### Billing

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/billing/run` | JWT | Create a billing cycle (one charge per unit) |
| `POST` | `/billing/levy` | JWT | Create a one-off levy charge per unit |

### Payments

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/payments/manual` | JWT | Record a cash/manual payment (runs reconciliation) |
| `POST` | `/payments/simulate` | JWT | Dev: simulate an inbound transfer through the full webhook→reconciliation path |

### Vendors & Payouts

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/vendors` | JWT | Add a vendor |
| `PATCH` | `/vendors/:vendorId` | JWT | Edit a vendor |
| `DELETE` | `/vendors/:vendorId` | JWT | Soft-delete a vendor |
| `GET` | `/vendors/banks` | JWT | List banks and their codes |
| `POST` | `/vendors/resolve-account` | JWT | Resolve account-holder name from account number + bank code |
| `POST` | `/payouts` | JWT | Initiate a vendor payout via Nomba |

### Exceptions

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/exceptions/:id/resolve` | JWT | Resolve a payment exception (credit / refund / duplicate / reassign / attribute) |

### Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/estate/:id/reports` | JWT | Money in vs out, spend by category, collection over time, arrears |
| `GET` | `/estate/:id/account-balance` | JWT | Live Nomba sub-account balance |

### Public (no auth)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/public/:token` | — | Resident statement by link token (tokenised, no login required) |

### Realtime

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/stream/ticket` | JWT | Mint a 60-second stream-scoped SSE ticket |
| `GET` | `/stream` | Stream ticket (`?token=`) | SSE stream of estate changes |

### Infrastructure

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/webhooks/nomba` | HmacSHA256 | Nomba inbound payment/payout events (excluded from Swagger) |
| `GET` | `/health` | — | Application health check |
