# Gatehouse PRD

Estate dues and service charge collection, built on Nomba virtual accounts.

> This document is for an engineering agent (Claude Code) to implement the backend and real integrations behind a frontend prototype that was generated in Lovable. The prototype ships as a Vite React app with mock data and client-side state. The first job is to port it to Next.js (App Router) and then replace the mock data with real persistence and live Nomba API calls.
>
> Verify all Nomba endpoint shapes, field names, webhook event names, and signature schemes against the live documentation at https://developer.nomba.com before implementing. Where this PRD states a payload, treat it as the intended contract and confirm exact spelling against the docs.

---

## 1. Product overview

**What it is.** Gatehouse is a financial operations product for a Nigerian residential estate. An estate manager (treasurer) uses it to bill residents for recurring service charges and one-off levies, collect those payments by bank transfer, have every payment reconcile to the correct unit automatically, chase arrears, pay estate vendors, and publish a transparent record of where the money went. Residents get a no-login page to view their own statement and the estate's spending.

**Who uses it.**
- The **manager / treasurer**: the primary authenticated user, runs the whole dashboard.
- The **resident**: views a read-only, tokenised statement page. No account, no login.

**Why it matters.** Nigerian estates run dues collection on WhatsApp groups, one person's personal bank account, and a spreadsheet reconciled by hand. Attribution (knowing which resident paid which amount) is the core pain. Estate dues are legally voluntary in Nigeria, so residents only keep paying when they trust the books, which makes transparent reporting a product requirement, not a nice-to-have.

**Track discipline (important constraint).** This is a build-track product for one specific business owner, the estate treasurer. It is **not** a reusable developer primitive. Do not build a public developer API, a generic multi-tenant SDK, or an identity/naming platform for downstream teams. Every feature should make the product better for the treasurer or the resident using it. Keep that lane.

## 2. How Gatehouse uses Nomba (the core idea)

Each **unit** in the estate is assigned its **own dedicated Nomba virtual account** (a real NUBAN). Because every unit has a unique account number, an inbound transfer is attributed to a unit **deterministically** by the account it landed in. There is no guessing, no narration matching, no AI inference. This is the structural advantage over tools that collect into one shared account and try to match payments afterwards.

Four Nomba APIs do four jobs:
- **Virtual Account API**: provision one dedicated account per unit. Solves attribution.
- **Webhooks**: receive inbound-transfer notifications in real time. Solves timing.
- **Transactions API**: the source of truth used to verify and backfill payments, and to build statements and reports. Solves correctness and audit.
- **Transfers / Payout API**: pay estate vendors out of the estate account. Solves the "money out" side, which powers transparency.

## 3. Personas and primary jobs

- **Treasurer (Bayo).** Jobs: set up the estate and units, bill a cycle, see who has and has not paid, resolve odd payments, pay vendors, publish where the money went.
- **Resident (Chidinma).** Jobs: know what she owes, pay it from her normal bank app, get an instant receipt, confirm her money was used properly.

## 4. Core domain model

Entities and the key relationships. Field lists are in section 9.

- **Estate**: the tenant of the system. Has many units, vendors, billing runs, levies. Holds the Nomba connection details and the allocation rule.
- **Unit**: a flat or house in the estate. Belongs to an estate. Has exactly one virtual account. Has many charges and payments. Carries a running balance and a credit balance.
- **VirtualAccount**: the Nomba-provisioned NUBAN for a unit. Stores account number, Nomba account reference, bank name, and provisioning status.
- **Resident**: occupant of a unit (name, phone, owner or tenant). For the prototype a unit has one current resident.
- **Charge**: an amount a unit owes. Created by a billing run (recurring service charge) or a levy (one-off). Has a due date, original amount, and amount outstanding.
- **BillingRun**: a batch that creates one service-charge charge per selected unit for a cycle.
- **Levy**: a one-off charge definition applied to selected units, optionally requiring an exact amount.
- **Payment**: an inbound transfer received into a unit's virtual account (or recorded manually for cash). Has gross amount, source detail, timestamp, and a reconciliation status.
- **Allocation**: the join recording how much of a payment was applied to which charge. A payment can split across several charges; a charge can be filled by several payments.
- **CreditBalance**: surplus held against a unit after a charge is fully paid, auto-applied to the next charge.
- **Exception**: a payment that could not be cleanly applied and needs a human decision (overpayment, duplicate, misdirected, third-party).
- **Vendor**: an estate supplier (security, waste, diesel, repairs) with bank details.
- **Payout**: an outbound transfer to a vendor via Nomba Transfers.

## 5. Key flows

**5.1 Onboarding.**
1. Manager signs up and creates the estate.
2. Manager connects the estate's Nomba account (store credentials securely, server-side only).
3. Manager sets the fee structure (recurring service charge amount and cadence, optional levy categories).
4. Manager adds units (CSV bulk upload or manual). On save of each unit, call the Virtual Account API to provision its dedicated NUBAN and store the result against the unit. Show the account numbers back to the manager.

**5.2 Billing a cycle.** Manager creates a billing run for the cycle. The system creates one service-charge Charge per selected unit, applies any existing credit balance immediately, then notifies each resident with the amount owed, due date, and the unit's account number.

**5.3 Payment reconciliation (the heart of the product).** A resident transfers into the unit's account. Nomba fires a webhook. The system identifies the unit from the destination account, records a Payment, runs the reconciliation engine (section 6) to allocate it across that unit's open charges, updates balances, generates a receipt, notifies the resident, and updates the manager dashboard in real time. Unattributable or ambiguous payments become Exceptions.

**5.4 Exception resolution.** Manager opens the exceptions queue and resolves each item (move surplus to credit or flag refund, confirm or split a duplicate, reassign a misdirected payment to the correct unit, attribute an on-behalf payment). Resolution writes the appropriate allocations and updates ledgers.

**5.5 Paying vendors.** Manager pays a vendor via the Transfers API. The payout is recorded and appears in reports as money out.

**5.6 Resident view.** Resident opens the tokenised link and sees the unit statement, the account number to pay into, receipts, and the estate transparency summary.

## 6. Reconciliation engine specification (scored centrepiece)

This is the most important logic in the product and the primary judging criterion. Implement it as a single, well-tested server-side module that takes a Payment and a unit's open charges and produces allocations plus a resulting status. Make it deterministic and idempotent.

**6.1 Inputs.** A Payment (amount, unit, timestamp, source, external reference), the unit's open Charges (each with outstanding amount and due date), the unit's current credit balance, and the estate's allocation rule.

**6.2 Allocation rules (configurable per estate).**
- Default: **oldest charge first** (apply the payment to the charge with the earliest due date, then the next, until the payment is exhausted).
- Alternative: **dues before levies** (service charges take priority over levies, then oldest first within each group).
The chosen rule is read from estate settings.

**6.3 Cases to handle explicitly.**
- **Exact payment**: amount equals total outstanding. Apply fully, mark charges settled, unit status becomes paid.
- **Underpayment / partial**: amount is less than outstanding. Apply across charges per the rule until exhausted. Remaining charges keep an outstanding balance. Unit status becomes partial. Schedule a reminder for the shortfall.
- **Overpayment**: amount exceeds total outstanding. Apply to all open charges, then route the surplus. Default behaviour: move surplus to the unit's credit balance and auto-apply it to the next charge created. Alternative: raise an Exception offering "move to credit" or "flag for refund" if the surplus exceeds a configurable threshold. Document which behaviour is active.
- **Split / multiple payments**: several payments over time against the same charge. Each payment reduces the outstanding amount; the charge settles when cumulative allocations reach the original amount.
- **Payment with an existing credit balance**: apply available credit first, then the new payment.
- **Arrears aging**: for any outstanding charge, compute age from due date into buckets (0 to 30, 31 to 60, 61 to 90, over 90 days) for the unit statement and the arrears report.

**6.4 Exception classification.** A payment becomes an Exception, not a clean allocation, when:
- **Overpayment** beyond the configured auto-credit threshold (needs a credit-or-refund decision).
- **Duplicate**: same amount, same unit, same source, within a short configurable window. Hold for confirmation rather than double-counting.
- **Misdirected**: a payment that arrives but the unit has no open charge to apply it to, or a manually flagged wrong-unit payment. Offer reassignment.
- **Third-party / on-behalf**: sender name differs materially from the occupant. Apply provisionally but tag for review, or hold, per estate preference.

**6.5 Idempotency and integrity.** Every payment carries Nomba's unique transaction reference. Persist it and reject or ignore repeats so a re-delivered webhook never double-credits. All money math is integer minor units (kobo) internally, formatted to Naira only at the edges. Reconciliation must produce the same result if re-run on the same inputs.

## 7. Nomba API integration

Confirm exact paths, field names, auth headers, and event names against https://developer.nomba.com. Known shapes from the docs are below.

**7.1 Auth.** Server-side only. Requests use a Bearer token in the `Authorization` header and the parent account id in an `accountId` header. Base URL `https://api.nomba.com`. Never expose tokens to the browser. Obtain and refresh tokens per Nomba's auth guide.

**7.2 Virtual Account API (provision per unit).**
- Create: `POST /v1/accounts/virtual` with a JSON body including `accountRef` (store the unit id here so inbound funds are traceable to the unit), `accountName` (for example "MAPLE COURT / B-04"), `currency` ("NGN"), and optionally `bvn`. For the recurring dues account, do **not** set `expectedAmount`, because partial and over payments are core to the product. `expectedAmount` and `expiryDate` may be used for a specific one-off levy that requires an exact figure.
- Look up: `GET /v1/accounts/virtual/{virtualAcctNumber}`.
- Suspend: `PUT /v1/accounts/suspend/{accountId}`.
- Filter / list: the list endpoint for retrieving accounts by condition (for example by name or status).
- Funds received into any virtual account route automatically to the estate's parent Nomba account. Gatehouse never holds funds; it orchestrates and records.

**7.3 Webhooks (real-time inbound).**
- Register a webhook endpoint and handle the inbound-transfer / successful-collection event. Confirm the exact event name and payload in the docs.
- On receipt: verify the signature, look up the unit by the destination virtual account (or by `accountRef`), persist the Payment with Nomba's transaction reference for idempotency, then run the reconciliation engine.
- Respond fast (acknowledge, then process), handle retries idempotently, and treat the webhook as a trigger rather than the source of truth.

**7.4 Transactions API (source of truth, verify and backfill).**
- Use it to verify a webhook-reported payment and to backfill any payments missed while the service was down (reconcile on a schedule and on demand). Build unit statements and estate reports from persisted, verified transaction data.

**7.5 Transfers / Payout API (vendor payouts).**
- Use the payout endpoint to send money from the estate account to a vendor's bank account. Record each Payout with status and Nomba reference, and reflect failures in the UI. This data drives the transparency report's "money out" side.

**7.6 Security notes.** Store Nomba credentials encrypted, scoped per estate. Verify webhook signatures. Rate-limit and log all Nomba calls. Keep all secrets in environment variables, never in the client bundle.

## 8. Pages and acceptance criteria

The Lovable prototype already contains these screens. Wire each to real data and logic.

- **Landing, auth.** Functional signup and login. Session handling.
- **Onboarding wizard.** Persists estate, fee structure, units. Provisions a virtual account per unit on save and displays the numbers. Acceptance: a newly added unit has a stored, valid NUBAN.
- **Dashboard.** KPIs, unit status grid, and live activity feed reflect real persisted state. Acceptance: a payment received (via webhook or the simulate control in dev) updates the right unit's status and the counters without a manual refresh.
- **Units and unit detail.** Per-unit statement shows charges, payments, allocations, credit balance, and arrears aging accurately. Acceptance: the running balance equals original charges minus allocated payments at every row.
- **Billing and levies.** Creating a billing run generates one charge per selected unit and notifies residents. Levy with "require exact amount" sets `expectedAmount` on the relevant account or enforces exactness in logic. Acceptance: billed totals match charges created.
- **Payments ledger.** Lists all inbound payments with correct status and attribution. Exceptions are flagged.
- **Exceptions queue.** Each exception type resolves correctly and writes the right allocations or credit entries, and decrements the unmatched counter. Acceptance: resolving an overpayment moves the surplus to credit and that credit applies to the next charge.
- **Vendors and payouts.** Paying a vendor calls the Transfers API and records the payout. Acceptance: a successful payout reduces the estate balance and appears in reports.
- **Reports and transparency.** Money in versus out, spending by category, collection over time, and arrears report all compute from real data. The public transparency view renders from the same numbers.
- **Resident page.** Tokenised, no login, mobile-first. Shows the correct unit's statement, account number, receipts, and transparency summary. Acceptance: the token resolves only to that unit's data.

## 9. Data model (suggested schema)

Use a relational store. Money stored as integer kobo. Suggested tables and key fields:

- **estates**: id, name, address, city, state, nomba_account_id, nomba_credentials_ref, allocation_rule, service_charge_amount, service_charge_cadence, created_at.
- **units**: id, estate_id, label, block, occupant_name, occupant_phone, occupancy_type (owner or tenant), balance_kobo, credit_balance_kobo, status, created_at.
- **virtual_accounts**: id, unit_id, nomba_account_ref, account_number, bank_name, status, provisioned_at.
- **billing_runs**: id, estate_id, cycle_label, charge_amount_kobo, unit_scope, created_at.
- **levies**: id, estate_id, name, amount_kobo, due_date, unit_scope, require_exact (bool), created_at.
- **charges**: id, unit_id, source_type (service_charge or levy), source_id, original_amount_kobo, outstanding_kobo, due_date, status, created_at.
- **payments**: id, unit_id (nullable for unmatched), nomba_txn_ref (unique), gross_amount_kobo, source_name, source_account, received_at, status (matched, partial, overpayment, exception, manual), raw_payload.
- **allocations**: id, payment_id, charge_id, amount_kobo, created_at.
- **exceptions**: id, payment_id, type, suggested_action, status (open or resolved), resolved_at, resolution_note.
- **vendors**: id, estate_id, name, category, bank_name, account_number, created_at.
- **payouts**: id, estate_id, vendor_id, amount_kobo, note, nomba_txn_ref, status, created_at.
- **resident_links**: id, unit_id, token (unique), created_at, last_viewed_at.
- **users**: id, estate_id, name, email, phone, role, password_hash, created_at.

## 10. Application structure (Next.js App Router)

Suggested routes. Adjust to match the ported components.

Pages:
- `/` landing
- `/login`, `/signup`
- `/onboarding` (wizard with steps)
- `/app` dashboard
- `/app/units`, `/app/units/[unitId]` (or a slide-over driven by query param)
- `/app/billing`
- `/app/payments`
- `/app/exceptions`
- `/app/vendors`
- `/app/reports`
- `/app/settings`
- `/r/[token]` resident statement (public)

API routes (server only):
- `POST /api/webhooks/nomba` inbound payment handler (signature verify, idempotent, triggers reconciliation)
- `POST /api/units` and bulk import (provisions virtual accounts)
- `POST /api/billing-runs`, `POST /api/levies`
- `POST /api/payments/manual` (cash or manual entry)
- `POST /api/exceptions/[id]/resolve`
- `POST /api/payouts` (calls Transfers API)
- `GET /api/units/[id]/statement`
- `POST /api/reconciliation/run` (manual backfill and verify via Transactions API)
- `GET /api/public/[token]` resident statement data

Keep the reconciliation engine in a framework-agnostic module (for example `lib/reconciliation.ts`) so it is unit-testable in isolation.

## 11. Tech stack and migration notes

- The prototype is Vite + React + Tailwind + shadcn/ui. Port to **Next.js (App Router)** with the same Tailwind theme and shadcn components. Move routing from the Vite router to the App Router, convert page components to route segments, and keep the design tokens identical.
- Backend in Next.js route handlers (or a separate Node service if preferred). A relational database (Postgres recommended). An ORM such as Prisma is fine.
- Real-time dashboard updates: use server-sent events or websockets so the unit grid and activity feed update when a webhook lands. A simple polling fallback is acceptable for the demo.
- Notifications (SMS, WhatsApp, email) can be stubbed behind an interface for the hackathon and logged, then wired to a real provider if time allows.
- Keep the **"Simulate payment"** dev control working end to end in non-production: it should post to the same internal reconciliation path the webhook uses, so the demo exercises real logic, not a separate fake path.

## 12. Environment variables

- `NOMBA_BASE_URL` (https://api.nomba.com)
- `NOMBA_CLIENT_ID`, `NOMBA_CLIENT_SECRET` (or API key per Nomba auth)
- `NOMBA_ACCOUNT_ID` (parent account id)
- `NOMBA_WEBHOOK_SECRET` (for signature verification)
- `DATABASE_URL`
- `APP_BASE_URL` (for building resident links)
- Notification provider keys (if wired)

## 13. Seed data and demo script

Seed realistic data so the demo lands. Estate **Maple Court**, Lekki, Lagos. 60 units across Blocks A to D. Quarterly service charge ₦45,000 and one active levy (₦10,000). A believable status mix: most paid, several partial, a few unpaid, one or two with credit, and 3 to 4 pre-seeded exceptions. Several vendors with payout history for the current cycle.

The demo should be able to:
1. Show the dashboard already reconciled, with a clear collection rate.
2. Fire a clean payment (exact dues) and show a unit flip to paid in real time with a receipt.
3. Fire an underpayment and show partial status, outstanding balance, and a scheduled reminder.
4. Fire an overpayment and show the surplus land in credit.
5. Open the exceptions queue and resolve a misdirected payment by reassigning it.
6. Pay a vendor, then open Reports and show money in versus out and the public transparency view.
7. End on the top-bar indicator reading **"Unmatched: 0"**.

## 14. Out of scope (do not build)

- A public developer API or SDK for other teams (that is the separate infrastructure track, not this product).
- Multi-estate marketplace, tenant onboarding KYC tiers, identity/naming platform features.
- Mobile native apps. The resident experience is a responsive web page.
- Anything that holds resident funds inside Gatehouse. Money settles into the estate's Nomba account.

