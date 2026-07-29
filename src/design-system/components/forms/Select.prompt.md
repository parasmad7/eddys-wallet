Native-backed dropdown for enumerated settings (allowance frequency, compounding, day of week).

```jsx
<Select label="How often?" value={freq} options={['Weekly','Biweekly','Monthly']} onChange={e=>setFreq(e.target.value)} />
```
