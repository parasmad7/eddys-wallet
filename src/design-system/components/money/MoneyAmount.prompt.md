Every dollar figure in the product goes through this — it takes integer cents (the PRD stores money as BIGINT cents) and renders tabular, display-face currency.

```jsx
<MoneyAmount cents={1050} size="hero" tone="plain" />
<MoneyAmount cents={-350} size="sm" signed />
```

Also exports `formatCents(cents)`. Never write raw `$` strings in a screen; never divide by 100 by hand.
