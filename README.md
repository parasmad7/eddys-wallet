# Eddy's Wallet

**Product Requirements Document**

A virtual allowance-tracking app that teaches kids financial literacy - without real money, bank accounts, or debit cards.

---

## 1. Product Overview

Eddy's Wallet is a family app where parents give children virtual money and progressively introduce real financial concepts as the child is ready. It is not a bank. No real currency moves. Instead, it is a hands-on teaching tool that makes abstract money concepts tangible through daily use.

**The problem:** Parents want to teach their kids about earning, saving, spending, and borrowing - but most options either require real bank accounts (Greenlight, Modak) or only track basic balances without teaching deeper concepts. There is no virtual-only app that starts simple and progressively layers in interest, loans, and credit as the child matures.

**The solution:** A virtual wallet that begins with a simple balance and deposits, then gradually introduces savings interest, goal-setting, loans, and credit card simulation - all within a polished, cloud-synced parent/child interface. The parent controls the pace of the curriculum by enabling features when the child is ready.

---

## 2. Target Users

### Parent persona

- Has one or more children aged 6-14
- Wants to teach financial literacy before the child gets a real bank account
- Comfortable with a web app; does not want to link a bank account or manage a prepaid card
- Uses the app on their phone to deposit allowance, configure rules, and monitor activity
- Values simplicity - does not want a complex fintech product

### Child persona

- Aged 6-14, with varying levels of math and reading ability
- May use a phone, tablet, laptop, or school Chromebook
- Wants to see "their money" and track progress toward goals
- Motivated by watching numbers grow (savings interest) and earning milestones
- Needs a simple, visual interface - not a miniature banking app

---

## 3. Product Vision and Goals

### Vision

Deliver a progressive financial literacy curriculum through hands-on experience with virtual money. The child learns by doing - not by watching videos or answering quizzes.

### Learning progression

| Stage | Concepts introduced | Features |
|-------|-------------------|----------|
| **Start** | Money has a balance. You can receive and spend it. | Spending account, deposits, withdrawals |
| **Savings** | Saving means choosing not to spend now. Money can grow over time. | Savings account, transfers, interest, goals |
| **Borrowing** | You can borrow money, but you pay more back than you borrowed. | Parent-to-child loans with interest and repayment |
| **Credit** | A credit card lets you spend money you don't have - but it costs you. | Revolving credit simulation with limits and interest |

### Goals

1. A child who uses Eddy's Wallet for 6 months should be able to explain what interest is, how saving works, and why borrowing costs money.
2. A parent should be able to set up the app in under 5 minutes and manage it in under 1 minute per week.
3. The app should run at zero cost for a single family on free-tier hosting.

---

## 4. User Stories

### Parent stories

| ID | Story | Acceptance criteria |
|----|-------|-------------------|
| P1 | As a parent, I can sign up with my email and password so I have a secure account. | Standard email/password registration. Email verification. |
| P2 | As a parent, I can create a family and name it (e.g., "The Smith Family"). | Family gets an auto-generated family code (e.g., "EDDY-7K3M"). |
| P3 | As a parent, I can add child profiles with names and PINs so each child has their own login. | 4-6 digit PIN per child. No email required for children. |
| P4 | As a parent, I can deposit money into my child's spending account. | Transaction appears in history. Balance updates in real time on all devices. |
| P5 | As a parent, I can set up a recurring allowance (e.g., $5 every Friday). | Supports daily, weekly, biweekly, and monthly frequencies. |
| P6 | As a parent, I can set an interest rate on my child's savings account (e.g., 5% annual). | Rate stored in basis points. Interest compounds on a configurable schedule. |
| P7 | As a parent, I can view all transactions across my children's accounts. | Filterable by child, account, date, and type. |
| P8 | As a parent, I can see the family code so I can share it with my child for login. | Code is always visible in the parent dashboard. |

### Child stories

| ID | Story | Acceptance criteria |
|----|-------|-------------------|
| C1 | As a child, I can log in on any device using my family code and PIN. | No email required. Works on phone, tablet, laptop. |
| C2 | As a child, I can see my current balance for each account. | Shows spending and savings balances clearly. |
| C3 | As a child, I can view my transaction history to see where my money came from and went. | Chronological list with descriptions (e.g., "Weekly allowance", "Birthday money from Grandma"). |
| C4 | As a child, I can transfer money from my spending account to my savings account. | Transfer appears as two transactions. Balances update immediately. |
| C5 | As a child, I can set a savings goal (e.g., "New bike - $50 by December"). | Goal has a name, target amount, optional deadline, and progress bar. |
| C6 | As a child, I can see interest being added to my savings over time. | Interest transactions appear in history with clear labels. |
| C7 | As a child, I can see my progress toward each savings goal. | Visual progress indicator (percentage and amount remaining). |

---

## 5. Feature Requirements

### Phase 1: Core Wallet + Savings (MVP)

#### 5.1 Accounts

- Each child gets a **spending account** and a **savings account** by default.
- Parents can create additional named accounts (e.g., "Emergency Fund").
- Account types: `spending` and `savings`.
- Balances stored in cents (integer) to avoid floating-point errors. Displayed as dollars in the UI (e.g., `1050` stored, `$10.50` displayed).

#### 5.2 Transactions

- Supported types: `deposit`, `withdrawal`, `allowance`, `interest`, `transfer`, `adjustment`.
- All transactions are **immutable** - no edits or deletes. Corrections use an `adjustment` transaction.
- Each transaction records a `balance_after` snapshot for fast dashboard reads.
- Transactions include a description field (e.g., "Weekly allowance", "Interest - May 2026").
- Parent can deposit and withdraw. Child can transfer between their own accounts.

#### 5.3 Recurring allowance

- Parent configures: amount, frequency (daily/weekly/biweekly/monthly), and target account.
- For weekly: parent picks a day of the week (e.g., Friday).
- For monthly: parent picks a day of the month (1-28).
- Allowance is disbursed automatically by a background job.
- Parent can pause, resume, or change the allowance at any time.

#### 5.4 Savings interest

- Parent sets an annual interest rate per savings account (e.g., 5% = 500 basis points).
- Parent chooses compounding frequency: daily, weekly, or monthly.
- Interest is calculated and credited automatically by a background job.
- Interest transactions appear in the child's history with clear labels.
- Example: A $100 savings balance at 5% annual interest compounded monthly earns approximately $0.42 in the first month.

#### 5.5 Savings goals

- Child creates a goal with: name (e.g., "New bike"), target amount (e.g., $50), and optional deadline.
- Goal tracks `current_amount` toward `target_amount`.
- Progress displayed as a percentage and visual bar.
- Goal status: `active`, `reached`, or `abandoned`.
- A child can have multiple active goals on the same savings account.

#### 5.6 Real-time sync

- All balance and transaction updates push to connected devices via WebSocket (Supabase real-time).
- When a parent deposits $5 on their phone, the child sees the updated balance on their tablet within seconds.

#### 5.7 PWA

- Installable via "Add to Home Screen" on iOS, Android, and desktop browsers.
- Service worker caches the app shell for fast loads.
- Offline: display cached last-known balances with a "last updated" timestamp. Full transactions require connectivity.
- App manifest with name, icons, and theme color.

### Phase 2: Loans and Credit

#### 5.8 Parent-to-child loans

- Parent creates a loan: principal amount, annual interest rate, minimum payment, and payment frequency (weekly/biweekly/monthly).
- Loan funds are disbursed to the child's spending account.
- Child makes payments from their spending account. Each payment reduces the loan balance.
- Loan tracks: original principal, outstanding balance, total interest paid, and payment history.
- Loan status: `active`, `paid_off`, or `forgiven` (parent can forgive remaining balance).

#### 5.9 Credit card simulation

- A special type of revolving loan with a credit limit set by the parent.
- Child can "charge" purchases up to the limit.
- Interest accrues on unpaid balances.
- Teaches the cost of carrying a balance vs. paying in full.

#### 5.10 Financial literacy badges

- Milestone-based achievements that reward learning through action.
- Examples: "First $100 saved!", "Loan paid off!", "3-month saving streak", "First interest earned".
- Badges appear on the child's dashboard.

### Phase 3: Polish

#### 5.11 Charts and visualizations

- Balance over time (line chart).
- Savings goal progress (bar or ring chart).
- Spending vs. saving breakdown.

#### 5.12 Push notifications

- Allowance received.
- Loan payment due.
- Savings goal reached.
- Opt-in, parent-controlled.

#### 5.13 Themes

- Kid-friendly color themes and avatars.
- Child can personalize their dashboard.

#### 5.14 CSV export

- Parent can export transaction history for any child as CSV.
- Useful for offline review or record-keeping.

---

## 6. Auth and Access Model

### Parent authentication

- **Method**: Email + password via Supabase Auth.
- **Future**: Google sign-in (Phase 2+).
- Parent's Supabase user ID is the family owner.

### Child authentication

- **Method**: Family code + PIN. No email required.
- The family has a unique `family_code` (auto-generated, short alphanumeric string, e.g., "EDDY-7K3M").
- Each child profile has a hashed PIN (bcrypt, 4-6 digits).
- Login flow:
  1. Child opens the app and taps "Kid Login".
  2. Child enters their family code and PIN.
  3. A Supabase Edge Function validates the PIN and returns a short-lived JWT.
  4. The JWT contains custom claims: `role: 'child'`, `profile_id`, `family_id`.
- **PIN security**: Rate-limited to 5 attempts per 15 minutes. Failed attempts are logged for parent review.

### Role-based access

| Action | Parent | Child |
|--------|--------|-------|
| View balances and transactions | All children in family | Own accounts only |
| Deposit / withdraw | Yes | No |
| Transfer between accounts | Yes | Own accounts only |
| Configure allowance and interest | Yes | No |
| Set savings goals | No (child's activity) | Yes |
| Create/manage loans | Yes | No |
| Make loan payments | No | Yes (from own spending) |

### Mode switching

The JWT's custom claims determine the UI:
- **Parent token**: Full management interface with read/write access to all family data.
- **Child token**: Read-only dashboard scoped to the child's own accounts.

Access is enforced at two layers:
1. **UI layer**: Conditional rendering based on JWT role.
2. **Database layer**: Row-level security (RLS) policies on every table. Even if the frontend has a bug, the database will not serve unauthorized data.

---

## 7. Data Model Overview

### Entity relationships

```
Family 1---* Profile (parent or child)
Profile 1---* Account (spending, savings)
Account 1---* Transaction (immutable ledger)
Account 1---* SavingsGoal
Family 1---* AllowanceRule
Account 1---* InterestConfig
Profile 1---* Loan (Phase 2)
```

### Key design decisions

| Decision | Detail |
|----------|--------|
| Money storage | All amounts in **cents** as integers (`BIGINT`). `$10.50` is stored as `1050`. No floats. |
| Transaction ledger | **Immutable** - no updates or deletes. Corrections are explicit `adjustment` transactions. |
| Interest rates | Stored in **basis points** (integer). `500` = 5.00%. Avoids rounding issues. |
| Running balance | Each transaction stores `balance_after` for fast reads without summing history. |
| Flexible metadata | Transactions have a `JSONB` metadata column for extensibility (e.g., linking a loan payment to its loan). |

For the full schema, table definitions, indexes, and RLS policies, see [`docs/architecture.md`](docs/architecture.md).

---

## 8. UX Principles

1. **Kid-friendly but not childish.** The interface should feel approachable for a 6-year-old but not embarrassing for a 14-year-old. Clean design, clear typography, no cartoon overload.

2. **Clear visual separation between parent and child modes.** Different color schemes or header treatments so it is immediately obvious which mode is active. A parent should never accidentally think they are in the child view, and vice versa.

3. **Progressive disclosure of financial concepts.** Start with just a balance and transactions. Introduce savings interest, goals, loans, and credit only when the parent enables them. The UI should not show features the child has not been introduced to yet.

4. **Instant feedback on actions.** When a parent deposits money, the child sees the update within seconds (real-time sync). When a child transfers money to savings, the balance change is immediate. No "pending" states for virtual money.

5. **Numbers are always clear.** Balances are large and prominent. Transaction amounts show positive/negative clearly. Interest earned is called out visually. Currency formatting is consistent ($10.50, not 10.5 or $10.5000).

6. **Mobile-first, responsive everywhere.** Designed for phone-sized screens first, but usable on tablets and laptops. The child may use a school Chromebook; the parent may use a desktop at work.

---

## 9. Tech Stack Summary

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | React + Vite + TypeScript | PWA with offline support |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS, accessible components |
| State management | TanStack Query | Server-state caching, optimistic updates |
| Routing | React Router | Client-side navigation |
| Backend | Supabase (PostgreSQL) | Database with ACID compliance, row-level security |
| Auth | Supabase Auth + Edge Functions | Parent email/password, child PIN validation |
| Real-time | Supabase real-time (WebSocket) | Cross-device sync |
| Background jobs | Supabase Edge Functions + external cron | Allowance disbursement, interest accrual |
| Frontend hosting | Vercel (free tier) | Auto-deploy from GitHub, edge caching |
| Backend hosting | Supabase (free tier) | Managed PostgreSQL, auth, real-time |

**Total hosting cost at family scale: $0/month.** Both Vercel and Supabase free tiers are more than sufficient for single-family use.

**Note:** The backend (Supabase database migrations, Edge Functions, and Terraform infrastructure-as-code) lives in a separate private repository. This public repo contains the frontend application and product documentation.

For full technical architecture, system diagrams, and implementation details, see [`docs/architecture.md`](docs/architecture.md).

---

## 10. Non-Functional Requirements

### Performance

- **Initial load**: Under 3 seconds on a 3G connection (PWA cached at Vercel edge).
- **Subsequent loads**: Under 1 second (service worker serves cached shell).
- **Real-time updates**: Balance changes propagate to all connected devices within 2 seconds.

### Security

- **Database-level access control**: RLS policies enforce that children can only read their own data, regardless of frontend behavior.
- **PIN rate limiting**: Maximum 5 failed PIN attempts per 15 minutes per family code. Prevents brute-force attacks.
- **No child PII**: Children provide only a name (no email, no birthdate, no address). Names are only visible within the family.
- **Encrypted at rest**: Supabase encrypts database storage by default.
- **HTTPS only**: All traffic between the PWA and Supabase is encrypted in transit.

### Offline support

- Service worker caches the app shell and static assets.
- Last-known balances are cached and displayed with a "last updated" timestamp when offline.
- Full transaction history and write operations require connectivity.
- The app does not attempt offline writes or conflict resolution - it simply shows stale data and re-syncs when connectivity returns.

### Accessibility

- All interactive elements are keyboard-navigable.
- Color choices meet WCAG 2.1 AA contrast ratios.
- Screen reader support via semantic HTML and ARIA attributes (provided by shadcn/ui components).
- Touch targets are at least 44x44px for mobile use.

### Cross-device compatibility

- Works on any device with a modern browser: iPhone, Android phone, iPad, Android tablet, laptop, desktop, Chromebook.
- PWA installable on iOS (Safari 16.4+), Android (Chrome), and desktop (Chrome, Edge).
- No native app required. No app store dependency.

---

## 11. Competitive Landscape

The market for kids' financial apps splits into two camps, and neither fully addresses the need Eddy's Wallet fills:

1. **Real-money platforms** (Greenlight, Modak, GoHenry/Acorns Early) - polished and well-funded, but require linked bank accounts and real debit cards. Wrong model for virtual-only financial education.

2. **Virtual trackers** (Bomad, Bankaroo, Kids Wallet) - handle basic allowance tracking but do not teach deeper financial concepts like interest, loans, or credit.

**The gap**: No existing virtual-only app combines parent/child dual modes, cloud sync, and a progressive curriculum that teaches balance management, savings interest, loans, and credit in an age-appropriate way.

The two closest competitors are FamZoo (primarily a real-money platform; virtual IOU mode is secondary, UI is dated, $5.99/month) and PracticeBank (right concept but iOS-only, uncertain maintenance, no loans, no educational progression).

For the full competitive analysis, see [`docs/market-research.md`](docs/market-research.md).

---

## 12. Success Metrics

### MVP (Phase 1) is complete when

- [ ] A parent can sign up, create a family, and add a child profile in under 5 minutes.
- [ ] A child can log in on a separate device using the family code and PIN.
- [ ] A child can see their spending and savings balances on a clear dashboard.
- [ ] A parent can deposit money into a child's account and the child sees the update in real time.
- [ ] A parent can configure a recurring allowance and it disburses automatically on schedule.
- [ ] A parent can set an interest rate on a savings account and interest accrues automatically.
- [ ] A child can set a savings goal with a target amount and track progress toward it.
- [ ] A child can transfer money from spending to savings.
- [ ] The app is installable as a PWA on at least iOS Safari, Android Chrome, and desktop Chrome.
- [ ] RLS policies prevent a child from seeing another child's data, even with a modified client.

### Key product metrics (post-launch)

| Metric | Target |
|--------|--------|
| Time to first deposit | Under 10 minutes from parent signup |
| Child login success rate | > 95% (family code + PIN is intuitive) |
| Weekly active usage | Child opens app at least 2x per week |
| Savings goal creation | > 50% of children create a goal within first month |
| Real-time sync latency | < 2 seconds for balance updates |

---

## 13. Constraints and Assumptions

### Constraints

- **Single-family use initially.** The MVP supports one family per Supabase project. Multi-family / multi-tenant support is a future consideration.
- **Free-tier hosting.** The MVP must run within Vercel and Supabase free tiers ($0/month). Feature choices should not require paid plans.
- **No real money.** All currency is virtual. The app must not connect to banks, process payments, or handle real funds.
- **No app store distribution.** PWA only. No iOS App Store or Google Play listing. The parent installs via "Add to Home Screen."
- **Parent sets up child access.** Children cannot self-register. A parent must create the child profile and share the family code and PIN.

### Assumptions

- Parents are willing to use a web app instead of a native app for a family financial tool.
- Children aged 6-14 can enter a short alphanumeric code and a 4-6 digit PIN.
- A single family's usage will stay well within Supabase and Vercel free-tier limits (500 MB database, 100 GB bandwidth).
- PWA install prompts and "Add to Home Screen" are sufficiently discoverable for a family app where the parent guides setup.
- Push notifications on iOS PWAs (Safari 16.4+) are reliable enough for Phase 3 notification features.
- The parent has at least one device with internet access for initial setup and ongoing deposits.
