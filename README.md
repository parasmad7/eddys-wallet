# Eddy's Wallet

A virtual allowance-tracking app that teaches kids financial literacy - without real money, bank accounts, or debit cards.

## What is this?

Eddy's Wallet lets parents give children virtual money and progressively introduce financial concepts as the child is ready. It's not a real bank - it's a teaching tool that makes abstract money concepts tangible.

- **Parent mode** - deposit, withdraw, set up recurring allowance, configure interest rates, manage child accounts
- **Child mode** - view balances, track transaction history, set savings goals, watch money grow

Everything syncs across devices in real time. When a parent deposits allowance on their phone, the child sees the updated balance on their tablet instantly.

## Key Features (MVP)

- **Core wallet** - spending and savings accounts with deposits, withdrawals, and transfers
- **Savings interest** - parents set an interest rate on savings accounts so kids can watch compound growth
- **Savings goals** - kids set a target amount and optional deadline, then track progress
- **Recurring allowance** - parents configure automatic deposits (weekly, biweekly, monthly)
- **Real-time sync** - changes appear on all family devices instantly via WebSocket
- **PWA** - works on any device with a browser (phone, tablet, laptop, Chromebook). No app store needed - just "Add to Home Screen"
- **Role-based access** - children log in with a family code + PIN (no email required). Database-level security ensures kids can only view their own data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript (PWA) |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + real-time subscriptions) |
| Hosting | Vercel (frontend), Supabase (backend) |
| Background jobs | Supabase Edge Functions (allowance disbursement, interest accrual) |

Both Vercel and Supabase free tiers are more than sufficient at family scale - total hosting cost is $0/month.

## Project Structure

```
docs/
  architecture.md    # Technical architecture and data model
  market-research.md # Competitive analysis and gap assessment
```

## Getting Started

> Setup instructions will be added as the project develops. See [docs/architecture.md](docs/architecture.md) for technical details on the planned stack and data model.

## Future Roadmap

Beyond the MVP, planned features include:

- **Loans** - parent-to-child loans with repayment schedules and interest
- **Credit card simulation** - revolving credit with limits and interest on balances
- **Financial literacy badges** - milestone rewards ("First $100 saved!", "Loan paid off!")
- **Charts and visualizations** - balance over time, savings progress, spending patterns
- **Push notifications** - alerts for allowance received, loan payments due

## License

TBD
