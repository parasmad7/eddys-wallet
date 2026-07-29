const {Button,IconButton,Card,Badge,Icon,SectionHeader}=window.EddySWalletDesignSystem_93be68;
const {Input,MoneyInput,PinPad}=window.EddySWalletDesignSystem_93be68;
const {BalanceCard,TransactionRow,GoalCard,StatTile,MoneyAmount,ProgressBar}=window.EddySWalletDesignSystem_93be68;
const {EddyTip,AchievementBadge,Toast,EmptyState,Dialog}=window.EddySWalletDesignSystem_93be68;
const {AppHeader,TabBar,Avatar}=window.EddySWalletDesignSystem_93be68;
const {IOSDevice}=window;

const TXNS=[
  {type:'allowance',description:'Weekly allowance',date:'Fri, Jul 24',cents:500,balanceAfter:1240},
  {type:'interest',description:'Interest — Jun 2026',date:'Jun 30',cents:42,balanceAfter:740},
  {type:'transfer',description:'Moved to savings',date:'Jun 24',cents:-1000,balanceAfter:698},
  {type:'deposit',description:'Birthday money from Grandma',date:'Jun 12',cents:2500,balanceAfter:1698},
  {type:'withdrawal',description:'Bought a book',date:'Jun 3',cents:-450,balanceAfter:-802}
];
const GOALS=[
  {name:'New bike',icon:'bike',targetCents:5000,currentCents:3200,deadline:'Dec 2026'},
  {name:'Video game',icon:'gamepad-2',targetCents:6000,currentCents:6000,status:'reached'}
];
const BADGES=[
  {icon:'piggy-bank',label:'First $100 saved',caption:'Apr 2026',earned:true},
  {icon:'sparkles',label:'First interest',caption:'Mar 2026',earned:true},
  {icon:'flame',label:'3-month streak',caption:'Jun 2026',earned:true},
  {icon:'hand-coins',label:'Loan paid off',caption:'Pay off a loan',earned:false},
  {icon:'target',label:'Goal master',caption:'Reach 3 goals',earned:false}
];

function LoginScreen({onLogin}){
  const [pin,setPin]=React.useState('');
  const [code,setCode]=React.useState('EDDY-7K3M');
  React.useEffect(()=>{if(pin.length===4)setTimeout(onLogin,350);},[pin]);
  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'var(--surface-page)'}}>
    <div style={{background:'linear-gradient(160deg,var(--grape-500),var(--grape-700))',padding:'28px 20px 22px',textAlign:'center',color:'#fff'}}>
      <img src="../../assets/eddy-mascot.svg" width="72" height="72" alt=""/>
      <div style={{font:'var(--type-title)',color:'#fff',marginTop:6}}>Kid Login</div>
      <div style={{font:'var(--type-caption)',color:'rgba(255,255,255,.8)',marginTop:2}}>Enter your family code and PIN</div>
    </div>
    <div style={{flex:1,padding:'20px',display:'flex',flexDirection:'column',gap:18,overflow:'auto'}}>
      <Input label="Family code" value={code} onChange={e=>setCode(e.target.value)} icon="users"/>
      <PinPad length={4} value={pin} onChange={setPin} label="Your PIN"/>
    </div>
  </div>;
}

function WalletScreen(){
  const [showAdd,setShowAdd]=React.useState(false);
  const [amt,setAmt]=React.useState('5.00');
  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'var(--surface-page)'}}>
    <AppHeader mode="kid" subtitle="The Smith Family" title="Hi, Maya! 👋"
      actions={<IconButton icon="bell" label="Alerts" variant="onBrand" size="sm"/>}>
      <BalanceCard kind="spending" cents={1240} note="+$5.00 next Friday" noteIcon="calendar-check"
        style={{background:'rgba(255,255,255,.14)',boxShadow:'none'}}/>
    </AppHeader>
    <div style={{flex:1,overflow:'auto',padding:'18px 16px 90px'}}>
      <div style={{display:'flex',gap:10,marginBottom:18}}>
        <Button variant="accent" icon="arrow-left-right" fullWidth onClick={()=>setShowAdd(true)}>Move to savings</Button>
        <Button variant="secondary" icon="piggy-bank" fullWidth>Savings</Button>
      </div>
      <EddyTip title="What's interest?" mascotSrc="../../assets/eddy-mascot.svg" style={{marginBottom:18}}>
        Your savings earn a little extra every month, just for staying put. Free money for waiting!
      </EddyTip>
      <SectionHeader title="Recent activity" action="See all"/>
      <Card pad="sm">
        {TXNS.slice(0,4).map((t,i)=><TransactionRow key={i} {...t} divider={i<3}/>)}
      </Card>
    </div>
    <Dialog open={showAdd} variant="sheet" title="Move to savings" onClose={()=>setShowAdd(false)}
      footer={<>
        <Button variant="secondary" fullWidth onClick={()=>setShowAdd(false)}>Cancel</Button>
        <Button fullWidth onClick={()=>setShowAdd(false)}>Move it</Button>
      </>}>
      <MoneyInput value={amt} onChange={setAmt} presets={[1,5,10,20]} hint="From spending → savings"/>
    </Dialog>
  </div>;
}

function GoalsScreen(){
  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'var(--surface-page)'}}>
    <AppHeader mode="kid" subtitle="Savings goals" title="Your goals"
      actions={<IconButton icon="plus" label="Add goal" variant="onBrand" size="sm"/>}/>
    <div style={{flex:1,overflow:'auto',padding:'18px 16px 90px',display:'flex',flexDirection:'column',gap:14}}>
      {GOALS.map((g,i)=><GoalCard key={i} {...g}/>)}
      <Button variant="secondary" icon="plus" fullWidth>New goal</Button>
    </div>
  </div>;
}

function HistoryScreen(){
  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'var(--surface-page)'}}>
    <AppHeader mode="kid" subtitle="Spending account" title="History"/>
    <div style={{flex:1,overflow:'auto',padding:'6px 16px 90px'}}>
      <Card pad="sm">{TXNS.map((t,i)=><TransactionRow key={i} {...t} divider={i<TXNS.length-1}/>)}</Card>
    </div>
  </div>;
}

function MeScreen(){
  return <div style={{height:'100%',display:'flex',flexDirection:'column',background:'var(--surface-page)'}}>
    <AppHeader mode="kid" subtitle="Your progress" title="Me"/>
    <div style={{flex:1,overflow:'auto',padding:'18px 16px 90px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <Avatar name="Maya" size={56}/>
        <div><div style={{font:'var(--type-title)',color:'var(--text-strong)'}}>Maya</div>
        <div style={{font:'var(--type-caption)',color:'var(--text-muted)'}}>Member since Jan 2026</div></div>
      </div>
      <SectionHeader title="Badges"/>
      <div style={{display:'flex',flexWrap:'wrap',gap:14,marginBottom:20}}>
        {BADGES.map((b,i)=><AchievementBadge key={i} {...b}/>)}
      </div>
      <SectionHeader title="This year"/>
      <div style={{display:'flex',gap:10}}>
        <StatTile label="Saved" cents={12480} icon="piggy-bank" tone="mint" style={{flex:1}}/>
        <StatTile label="Interest" cents={412} icon="sparkles" tone="gold" style={{flex:1}}/>
      </div>
    </div>
  </div>;
}

function KidApp(){
  const [authed,setAuthed]=React.useState(false);
  const [tab,setTab]=React.useState('home');
  const screens={home:WalletScreen,goals:GoalsScreen,history:HistoryScreen,me:MeScreen};
  const Screen=screens[tab];
  return <div data-theme="kid">
    <IOSDevice title="Eddy's Wallet">
      <div style={{height:'100%',display:'flex',flexDirection:'column',position:'relative'}}>
        {!authed?<LoginScreen onLogin={()=>setAuthed(true)}/>:<>
          <div style={{flex:1,overflow:'hidden'}}><Screen/></div>
          <TabBar value={tab} onChange={setTab} items={[
            {value:'home',label:'Wallet',icon:'wallet'},
            {value:'goals',label:'Goals',icon:'target'},
            {value:'history',label:'History',icon:'list'},
            {value:'me',label:'Me',icon:'smile',badge:true}
          ]}/>
        </>}
      </div>
    </IOSDevice>
  </div>;
}
window.KidApp=KidApp;
