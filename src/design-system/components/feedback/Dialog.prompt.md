Confirmations and short forms. Use `variant="sheet"` for anything a kid does on a phone (deposit, transfer, new goal).

```jsx
<Dialog variant="sheet" title="Move to savings" onClose={close}
  footer={<><Button variant="secondary" fullWidth onClick={close}>Cancel</Button><Button fullWidth>Move it</Button></>}>
  <MoneyInput value={amt} onChange={setAmt} presets={[1,5,10]} />
</Dialog>
```
