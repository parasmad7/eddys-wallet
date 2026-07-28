# Eddy's Wallet - Technical Architecture Report

## Summary

Recommended stack: **React + Vite + TypeScript PWA** on the frontend, **Supabase** (PostgreSQL + Auth + real-time) on the backend, deployed to **Vercel** (free tier). This gives a solo developer the fastest path to a working cross-platform family app with minimal infrastructure to manage, strong data integrity for financial tracking, and zero app-store friction.

---

## 1. Frontend: React PWA via Vite

### Recommendation: React + Vite + TypeScript, deployed as a Progressive Web App (PWA)

### Options evaluated

| Approach | Cross-platform | App store needed | Build complexity | Native feel | Solo-dev velocity |
|----------|---------------|-----------------|-----------------|-------------|-------------------|
| **React PWA** | All devices via browser | No | Low | Good | High |
| React Native (Expo) | iOS + Android + Web | Yes (for mobile) | Medium | Excellent | Medium |
| Flutter | iOS + Android + Web | Yes (for mobile) | Medium | Excellent | Medium (Dart) |
| Native iOS + Android | iOS + Android only | Yes | High | Excellent | Low |

### Why PWA wins for this app

1. **Zero app-store friction.** No Apple Developer Program ($99/year), no Google Play registration ($25), no review process. The parent installs it by tapping "Add to Home Screen" on any device. The child does the same on their device. Updates deploy instantly.

2. **Works on every device.** Phone, tablet, laptop, school Chromebook - any device with a modern browser. This directly matches the requirement that "parent may use phone, child may switch between devices."

3. **Simplest possible deployment.** A PWA is a static site. Push to git, Vercel builds and deploys in seconds. No app binary builds, no code signing, no provisioning profiles.

4. **The app doesn't need native capabilities.** Eddy's Wallet tracks numbers and displays them. It doesn't need camera, GPS, Bluetooth, or other hardware APIs. The one native feature that could matter - push notifications - is now supported on iOS 16.4+ for PWAs.

5. **React + TypeScript is the largest ecosystem.** Easiest to find solutions, libraries, and (if ever needed) contributors. TypeScript catches bugs at compile time, which matters when tracking financial data.

### Specific tooling

- **Vite** for build tooling (fast, zero-config for React + TS)
- **vite-plugin-pwa** for service worker generation, offline support, install prompts
- **Tailwind CSS** for styling (utility-first, responsive by default, fast iteration)
- **shadcn/ui** for component primitives (accessible, composable, no runtime dependency)
- **TanStack Query** for server-state management (caching, refetching, optimistic updates)
- **React Router** for client-side routing

### Tradeoffs accepted

- Slightly less "native" feel than React Native/Flutter (no native navigation transitions, no haptic feedback). For a number-tracking app, this is negligible.
- Home-screen install is less discoverable than an app store listing. For a family app shared by a parent to their child, this doesn't matter - the parent will set it up.

---

## 2. Backend & Data: Supabase

### Recommendation: Supabase (PostgreSQL + Auth + real-time subscriptions + row-level security)

### Options evaluated

| Service | Database | Auth built-in | Real-time | Free tier | Data portability | SQL support |
|---------|----------|--------------|-----------|-----------|-----------------|-------------|
| **Supabase** | PostgreSQL | Yes | Yes | Generous | Excellent (Postgres dump) | Full SQL |
| Firebase | Firestore (NoSQL) | Yes | Yes | Generous | Poor (proprietary format) | No |
| PlanetScale | MySQL | No | No | Discontinued free | Good | Full SQL |
| Custom (Express + Postgres on Fly.io) | PostgreSQL | DIY | DIY | Limited | Excellent | Full SQL |
| Cloudflare D1 | SQLite | No | No | Generous | Good | SQLite subset |

### Why Supabase wins for this app

1. **PostgreSQL is the right database for financial data.** Transactions, balances, loans, and interest calculations are inherently relational. ACID compliance means a deposit and balance update either both succeed or both fail. Firestore's eventual consistency and denormalized document model would fight this domain at every turn.

2. **Auth is built in and flexible.** Supabase Auth supports email/password, magic links, and anonymous sessions out of the box. This covers the parent login (email/password) and can support the child access pattern (see Auth section below).

3. **Row-level security (RLS) enforces access at the database level.** Policies like "children can only SELECT their own account data" and "only parents can INSERT transactions" are expressed as SQL policies on the tables themselves. This means even if the frontend has a bug, the database won't serve unauthorized data. This is the strongest security model of any option evaluated.

4. **Real-time subscriptions for cross-device sync.** When a parent deposits allowance, the child's view updates in real time via Supabase's Postgres-backed real-time channels. No polling, no manual refresh.

5. **Free tier covers family-scale with room to spare.** 500 MB database, 5 GB bandwidth, 50,000 monthly active users, 500 MB file storage. A family of 4 won't touch these limits.

6. **Data is portable.** It's just PostgreSQL. `pg_dump` exports everything. Can self-host Supabase later or migrate to any Postgres-compatible service.

### Supabase project structure

```
supabase/
  migrations/         # SQL migration files (version-controlled schema)
  seed.sql            # Development seed data
  config.toml         # Supabase CLI config
```

Use the Supabase CLI for local development (`supabase start` runs a local Postgres + Auth + real-time stack in Docker) and `supabase db push` for deploying migrations.

---

## 3. Auth & Mode Switching

### Recommendation: Parent authenticates with email/password; child accesses via a family-scoped PIN

### Design

```
Parent flow:
  1. Parent signs up with email + password (Supabase Auth)
  2. Parent creates a "family" and one or more child profiles
  3. Parent sets a simple PIN for each child (4-6 digits)
  4. Parent uses the app in full parent mode (read + write)

Child flow:
  1. Child opens the app on any device
  2. Child sees a "Kid Login" screen
  3. Child enters their family code (short alphanumeric, e.g., "EDDY-1234") + their PIN
  4. App validates PIN against the family's child records
  5. Child sees a read-only dashboard of their account(s)
```

### Implementation details

- **Parent auth**: standard Supabase Auth (email/password). The parent's Supabase user ID is the family owner.
- **Child auth**: children don't get full Supabase Auth accounts (no email required). Instead:
  - The family has a unique `family_code` (auto-generated, short, shareable).
  - Each child profile has a `pin_hash` (bcrypt hash of their 4-6 digit PIN).
  - A Supabase Edge Function (`/auth/child-login`) accepts `{ family_code, pin }`, validates the PIN, and returns a short-lived JWT with `role: 'child'` and `profile_id` claims.
  - RLS policies check these JWT claims to restrict children to SELECT-only on their own data.
- **Mode switching**: the JWT's custom claims determine the UI mode. Parent tokens get the full management UI; child tokens get the read-only dashboard. This is enforced at both the UI layer (conditional rendering) and the database layer (RLS policies).

### Why not simpler approaches

- **Just a PIN on the device (no server auth for kids)**: Insecure if the child guesses the parent PIN. Also doesn't support the child switching devices - there's no server-side session.
- **Full Supabase Auth accounts for children**: Requires an email address per child. Overkill for a family app. Creates account management burden.
- **Shared family password**: No way to distinguish parent from child. Defeats the purpose of role-based access.

### RLS policy sketch

```sql
-- Children can only read their own accounts
CREATE POLICY "children_read_own_accounts" ON accounts
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND profile_id = (auth.jwt() ->> 'profile_id')::uuid
  );

-- Parents can read/write all accounts in their family
CREATE POLICY "parents_manage_family_accounts" ON accounts
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'parent'
    AND family_id = (auth.jwt() ->> 'family_id')::uuid
  );
```

---

## 4. Data Model

### Entity-relationship overview

```
Family 1---* Profile (parent or child)
Profile 1---* Account (spending, savings, etc.)
Account 1---* Transaction
Profile 1---* Loan (as borrower; family parent is always lender)
Account 1---* SavingsGoal
Family 1---* AllowanceRule
Family 1---* InterestConfig
```

### Table definitions

```sql
-- The family unit. One parent creates it; children join via family_code.
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                        -- e.g., "The Smith Family"
  family_code TEXT UNIQUE NOT NULL,          -- e.g., "EDDY-7K3M" (for child login)
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A person in the family. Parent or child.
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                        -- display name
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  pin_hash TEXT,                             -- bcrypt hash, only for children
  avatar_url TEXT,                           -- optional avatar
  auth_user_id UUID REFERENCES auth.users(id), -- set for parents, NULL for children
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A wallet/account belonging to a child. Could have multiple (spending, savings).
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Spending',     -- "Spending", "Savings", "Emergency Fund"
  type TEXT NOT NULL CHECK (type IN ('spending', 'savings')) DEFAULT 'spending',
  balance BIGINT NOT NULL DEFAULT 0,         -- stored in cents to avoid float errors
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every money movement. Immutable ledger - never UPDATE or DELETE.
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'deposit', 'withdrawal', 'allowance',
    'interest', 'loan_disbursement', 'loan_payment',
    'transfer', 'adjustment'
  )),
  amount BIGINT NOT NULL,                    -- positive = credit, negative = debit (cents)
  balance_after BIGINT NOT NULL,             -- running balance snapshot (cents)
  description TEXT,                          -- "Weekly allowance", "Birthday money from Grandma"
  metadata JSONB DEFAULT '{}',               -- flexible: { loan_id, rule_id, etc. }
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recurring allowance configuration.
CREATE TABLE allowance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,                    -- cents per period
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  day_of_week INT,                           -- 0=Sun..6=Sat, for weekly
  day_of_month INT,                          -- 1-28, for monthly
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_run_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Interest configuration for savings accounts.
CREATE TABLE interest_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  annual_rate_bps INT NOT NULL DEFAULT 500,  -- basis points (500 = 5.00%)
  compound_frequency TEXT NOT NULL DEFAULT 'monthly'
    CHECK (compound_frequency IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Parent-to-child loans.
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  borrower_profile_id UUID NOT NULL REFERENCES profiles(id),
  borrower_account_id UUID NOT NULL REFERENCES accounts(id),
  principal BIGINT NOT NULL,                 -- original loan amount (cents)
  annual_rate_bps INT NOT NULL DEFAULT 0,    -- interest rate in basis points
  balance_remaining BIGINT NOT NULL,         -- outstanding balance (cents)
  min_payment BIGINT,                        -- minimum payment per period (cents)
  payment_frequency TEXT DEFAULT 'monthly'
    CHECK (payment_frequency IN ('weekly', 'biweekly', 'monthly')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paid_off', 'forgiven')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Savings goals for children.
CREATE TABLE savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                        -- "New bike", "Video game"
  target_amount BIGINT NOT NULL,             -- cents
  current_amount BIGINT NOT NULL DEFAULT 0,  -- cents saved toward this goal
  target_date DATE,                          -- optional deadline
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'reached', 'abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_accounts_profile_id ON accounts(profile_id);
CREATE INDEX idx_profiles_family_id ON profiles(family_id);
CREATE INDEX idx_allowance_rules_next_run ON allowance_rules(next_run_at)
  WHERE is_active = true;
```

### Design decisions

- **Amounts stored in cents (BIGINT).** Never use floats for money. `$10.50` is stored as `1050`. The frontend formats for display.
- **Transactions are immutable.** No UPDATE or DELETE on the transactions table. Corrections are new transactions of type `adjustment`. This creates a true audit trail - critical for a financial literacy app where kids should see the history.
- **`balance_after` on each transaction.** Denormalized for fast reads. The child's dashboard can show a running balance without summing all transactions. The `accounts.balance` field is the authoritative current balance, updated atomically with each transaction insert (via a database function + trigger or a Supabase Edge Function).
- **`metadata` JSONB column.** Avoids schema changes for future features. A loan payment transaction can link to its loan via `{ "loan_id": "..." }` without a new column.
- **Interest rates in basis points.** `500` = 5.00%. Integer math avoids rounding issues. Standard financial convention.

---

## 5. System Architecture

```
+-------------------+         +----------------------------+
|                   |         |         Supabase           |
|   React PWA       | <-----> |                            |
|   (Vite + TS)     |  HTTPS  |  Auth (JWT)                |
|                   |         |  PostgreSQL (data)          |
|   Hosted on       |         |  Real-time (WebSocket)     |
|   Vercel          |         |  Edge Functions (cron jobs) |
|                   |         |  Row-Level Security         |
+-------------------+         +----------------------------+
```

### Request flow

1. **Parent opens app** - React PWA loads from Vercel CDN (fast, cached at edge).
2. **Parent logs in** - Supabase Auth issues a JWT with `role: parent, family_id: ...`.
3. **Parent deposits $5** - React calls Supabase Edge Function `deposit()`, which:
   - Validates the JWT claims
   - Inserts a transaction row
   - Updates the account balance atomically
   - Returns the new balance
4. **Child opens app on their device** - PWA loads, child enters family code + PIN.
5. **Child login** - Edge Function validates PIN, issues JWT with `role: child, profile_id: ...`.
6. **Child sees updated balance** - Supabase real-time subscription pushes the new balance. No refresh needed.

### Background jobs (allowance, interest)

Supabase supports cron jobs via `pg_cron` (available on all paid plans) or via Edge Functions triggered by an external cron (e.g., Vercel Cron, GitHub Actions, or cron-job.org free tier).

- **Allowance disbursement**: Runs on schedule (e.g., every hour), queries `allowance_rules WHERE next_run_at <= now() AND is_active`, inserts transactions, updates balances, advances `next_run_at`.
- **Interest accrual**: Runs daily/weekly/monthly per config, calculates interest on savings account balances, inserts interest transactions.

For MVP, these can be simple Supabase Edge Functions triggered by a cron. No separate server needed.

---

## 6. Deployment & Hosting

### Frontend: Vercel (free tier)

- **Cost**: $0 for hobby use. 100 GB bandwidth/month, serverless functions included.
- **Setup**: Connect GitHub repo, Vercel auto-deploys on every push to `main`.
- **Custom domain**: Supported on free tier (e.g., `eddyswallet.com`).
- **Edge caching**: Static assets cached globally. PWA loads fast everywhere.

### Backend: Supabase (free tier)

- **Cost**: $0 for the free plan. 500 MB database, 5 GB bandwidth, 50K MAU, 500K Edge Function invocations/month.
- **Upgrade path**: $25/month Pro plan if the app grows beyond family use. Adds daily backups, 8 GB database, and `pg_cron`.
- **Region**: Choose the closest region to the family (e.g., `us-east-1` for East Coast US).

### Total cost at family scale: $0/month

Both Vercel and Supabase free tiers are more than sufficient for a single family's usage. The first dollar is only needed if the app grows to serve many families or if `pg_cron` is required (Pro plan).

### Domain (optional)

A `.com` domain costs ~$10-12/year. Not required for MVP - the Vercel subdomain (e.g., `eddys-wallet.vercel.app`) works fine for a family app.

---

## 7. MVP Scope & Build Order

### Phase 1 - Core Wallet (MVP) - ~2-3 weeks for a solo developer

1. **Project setup**: Vite + React + TypeScript + Tailwind + PWA plugin + Supabase client
2. **Supabase setup**: Project creation, schema migration for `families`, `profiles`, `accounts`, `transactions`
3. **Parent auth**: Sign up / sign in with email + password
4. **Family creation**: Parent creates family, adds child profiles with PINs
5. **Child login**: Family code + PIN flow via Edge Function
6. **Account management**: Create spending account for each child
7. **Transactions**: Parent can deposit and withdraw. Both parent and child see transaction history.
8. **Balance dashboard**: Child sees current balance, recent transactions
9. **PWA install**: Service worker, manifest, offline shell, "Add to Home Screen" prompt

**At the end of Phase 1**: A working app where a parent can give a child virtual money and the child can see their balance on any device.

### Phase 2 - Allowance & Savings - ~2 weeks

10. **Allowance rules**: Parent configures recurring allowance (amount, frequency)
11. **Allowance cron**: Background job disburses allowance on schedule
12. **Savings accounts**: Child can have a savings account alongside spending
13. **Transfers**: Child can move money between their own accounts (spending to savings)
14. **Interest config**: Parent sets interest rate on savings accounts
15. **Interest cron**: Background job calculates and credits interest
16. **Savings goals**: Child sets targets ("New bike - $50"), tracks progress

### Phase 3 - Loans & Advanced Concepts - ~2 weeks

17. **Loans**: Parent creates a loan for the child (principal, rate, min payment)
18. **Loan payments**: Child makes payments from spending account; loan balance decreases
19. **Loan dashboard**: Visual breakdown of principal, interest, remaining balance
20. **Credit card simulation**: A special loan type with a revolving credit limit
21. **Financial literacy badges**: Milestones ("First $100 saved!", "Loan paid off!")

### Phase 4 - Polish - ~1 week

22. **Charts**: Balance over time, spending categories, savings progress
23. **Notifications**: Optional push notifications for allowance received, loan payment due
24. **Themes**: Kid-friendly UI themes (colors, avatars)
25. **Export**: Parent can export transaction history as CSV

---

## 8. Key Technical Decisions and Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Money storage | BIGINT cents | Floats cause rounding errors with money. Cents are exact. |
| Database | PostgreSQL (via Supabase) | ACID compliance for financial data. Relational model fits transactions/accounts naturally. |
| Frontend | PWA over native app | Zero app-store friction. Works on all devices. Simplest deployment for a solo dev. |
| Child auth | PIN + family code (not full accounts) | Kids don't have email addresses. PIN is age-appropriate. Server-validated for cross-device support. |
| Transaction history | Immutable append-only | Financial literacy requires seeing the full story. Corrections are explicit adjustment transactions. |
| Real-time sync | Supabase real-time | Parent deposits show up on child's device without refresh. Built into Supabase, no extra infrastructure. |
| Hosting | Vercel + Supabase free tiers | $0/month for family scale. Upgrade path exists if the app grows. |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase free tier limits | App stops working if limits exceeded | Monitor usage; $25/month Pro plan as escape hatch. Family scale is well within free limits. |
| PWA install UX on iOS | Slightly clunky "Add to Home Screen" flow | Clear onboarding instructions in the app. Safari PWA support has improved significantly since iOS 16.4. |
| Child PIN security | A child could brute-force another child's PIN | Rate-limit PIN attempts in the Edge Function (max 5 attempts per 15 minutes). Log failed attempts for parent review. |
| Offline usage | App doesn't work without internet | Service worker caches the app shell and last-known data. Show cached balance with "last updated" timestamp. Full transactions require connectivity. |
| Supabase vendor lock-in | Migration pain if Supabase changes pricing | All data is in standard PostgreSQL. `pg_dump` exports everything. Supabase is open-source and self-hostable. |

---

## 10. Alternatives Considered But Not Recommended

### Firebase + React Native
Firebase's NoSQL model (Firestore) is a poor fit for financial transaction data. Maintaining referential integrity across denormalized documents requires application-level enforcement that PostgreSQL handles natively. React Native adds build complexity (Xcode, Android Studio, app store submissions) without meaningful UX benefit for this simple app.

### Next.js full-stack (API routes + Prisma + hosted Postgres)
Viable, but reinvents what Supabase provides out of the box (auth, real-time, RLS, admin dashboard). The API route layer adds code to maintain without adding capability. Supabase's client SDK talks directly to the database with RLS enforcement, eliminating the need for a custom API layer.

### Expo (React Native for Web + Mobile)
A reasonable middle ground if native app store presence is desired later. However, Expo's web output is less optimized than a purpose-built PWA, and the added complexity of managing native builds isn't justified for the MVP. Could migrate to Expo later if app store distribution becomes a requirement.

### SQLite (local-first with sync)
Appealing for offline-first, but adds significant complexity for multi-device sync. Libraries like `cr-sqlite` and `electric-sql` are promising but immature. Supabase's real-time subscriptions solve the same problem with battle-tested infrastructure.
