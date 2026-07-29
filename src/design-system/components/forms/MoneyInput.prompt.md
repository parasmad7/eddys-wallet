Hero amount entry for deposits, withdrawals, transfers, and loan payments — the number is the biggest thing on screen.

```jsx
<MoneyInput label="How much?" value={amt} onChange={setAmt} presets={[1,5,10,20]} />
```

Always pair with quick-pick presets for the amounts a family uses weekly. Keep values as dollar strings in the UI and convert to integer cents before "saving".
