One line of the immutable ledger. Icon + colour are derived from the transaction type, so kids can read the history at a glance.

```jsx
<TransactionRow type="interest" description="Interest — May 2026" date="May 31" cents={42} balanceAfter={12480} />
```

Show `balanceAfter` in parent mode (audit trail) and omit it in kid mode unless the child taps into detail.
