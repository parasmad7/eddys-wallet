Bottom navigation for the PWA. Three to four destinations, never more.

```jsx
<TabBar value={tab} onChange={setTab} items={[
  {value:'home',label:'Wallet',icon:'wallet'},
  {value:'goals',label:'Goals',icon:'target'},
  {value:'history',label:'History',icon:'list'},
  {value:'me',label:'Me',icon:'smile',badge:true}]} />
```

Kid mode: Wallet / Goals / History / Me. Parent mode: Family / Activity / Rules / Settings.
