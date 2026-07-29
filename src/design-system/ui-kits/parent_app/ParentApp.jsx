const {Button,IconButton,Card,Badge,Icon,SectionHeader,Tag}=window.EddySWalletDesignSystem_93be68;
const {Input,MoneyInput,Select,Switch,SegmentedControl}=window.EddySWalletDesignSystem_93be68;
const {BalanceCard,TransactionRow,GoalCard,LoanCard,StatTile,MoneyAmount}=window.EddySWalletDesignSystem_93be68;
const {Dialog,EmptyState}=window.EddySWalletDesignSystem_93be68;
const {AppHeader,Tabs,AvatarChip,Avatar}=window.EddySWalletDesignSystem_93be68;
const {ChromeWindow}=window;

const KIDS=[
  {name:'Maya',spending:1240,savings:12480,goals:2,age:11},
  {name:'Ben',spending:375,savings:2100,goals:1,age:8}
];
const TXNS=[
  {type:'allowance',description:'Weekly allowance — Maya',date:'Fri, Jul 24, 4:00 PM',cents:500,balanceAfter:1240},
  {type:'interest',description:'Interest — Maya, Jun 2026',date:'Jun 30, 12:00 AM',cents:42,balanceAfter:740},
  {type:'deposit',description:'Birthday money from Grandma — Maya',date:'Jun 12, 6:14 PM',cents:2500,balanceAfter:1698},
  {type:'allowance',description:'Weekly allowance — Ben',date:'Fri, Jul 24, 4:00 PM',cents:300,balanceAfter:375},
  {type:'loan_payment',description:'Skateboard loan payment — Ben',date:'Jul 20, 5:02 PM',cents:-500,balanceAfter:75}
];

function FamilyDashboard({onSelectKid}){
  return <div>
    <AppHeader mode="parent" subtitle="Parent mode" title="The Smith Family"
      actions={<IconButton icon="settings" label="Settings" variant="onBrand" size="sm"/>}/>
    <div style={{padding:'24px 28px',maxWidth:960,margin:'0 auto'}}>
      <Card tone="tint" pad="md" style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Icon name="key-round" size={18} style={{color:'var(--brand-strong)'}}/>
          <div>
            <div style={{font:'var(--type-caption)',color:'var(--text-muted)'}}>Family code — share this with your kids</div>
            <div style={{font:'var(--weight-bold) 20px/1 var(--font-mono)',color:'var(--text-strong)',letterSpacing:'.04em'}}>EDDY-7K3M</div>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon="copy">Copy</Button>
      </Card>
      <SectionHeader title="Children" action="Add child" actionIcon="plus"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:28}}>
        {KIDS.map(k=><Card key={k.name} interactive onClick={()=>onSelectKid(k)} pad="md">
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
            <Avatar name={k.name} size={44}/>
            <div><div style={{font:'var(--type-section)',color:'var(--text-strong)'}}>{k.name}</div>
            <div style={{font:'var(--type-caption)',color:'var(--text-muted)'}}>Age {k.age} · {k.goals} active goal{k.goals!==1?'s':''}</div></div>
          </div>
          <div style={{display:'flex',gap:20}}>
            <div><div style={{font:'var(--type-caption)',color:'var(--text-muted)'}}>Spending</div><MoneyAmount cents={k.spending} size="md" tone="plain"/></div>
            <div><div style={{font:'var(--type-caption)',color:'var(--text-muted)'}}>Savings</div><MoneyAmount cents={k.savings} size="md" tone="plain"/></div>
          </div>
        </Card>)}
      </div>
      <SectionHeader title="Recent activity across the family" action="View all"/>
      <Card pad="sm">{TXNS.map((t,i)=><TransactionRow key={i} {...t} divider={i<TXNS.length-1}/>)}</Card>
    </div>
  </div>;
}

function AccountsTab({kid,onDeposit}){
  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <BalanceCard kind="spending" cents={kid.spending} note="+$5.00 next Friday" noteIcon="calendar-check"/>
      <BalanceCard kind="savings" cents={kid.savings} note="5.0% annual, compounds monthly" noteIcon="sparkles"/>
    </div>
    <div style={{display:'flex',gap:10}}>
      <Button icon="plus" onClick={onDeposit}>Deposit</Button>
      <Button variant="secondary" icon="minus">Withdraw</Button>
      <Button variant="ghost" icon="download">Export CSV</Button>
    </div>
    <SectionHeader title="Goals"/>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <GoalCard name="New bike" icon="bike" targetCents={5000} currentCents={3200} deadline="Dec 2026"/>
      <GoalCard name="Video game" icon="gamepad-2" targetCents={6000} currentCents={6000} status="reached"/>
    </div>
  </div>;
}

function RulesTab(){
  const [interest,setInterest]=React.useState(true);
  const [loans,setLoans]=React.useState(false);
  const [credit,setCredit]=React.useState(false);
  return <div style={{display:'flex',flexDirection:'column',gap:20,maxWidth:520}}>
    <SectionHeader title="Recurring allowance"/>
    <Card pad="md" style={{display:'flex',flexDirection:'column',gap:14}}>
      <MoneyInput label="Amount" value="5.00" presets={[2,5,10,20]}/>
      <Select label="Frequency" options={['Weekly','Biweekly','Monthly']}/>
      <Select label="Day" options={['Monday','Friday','Sunday']}/>
      <div style={{display:'flex',gap:10}}><Button size="sm">Save rule</Button><Button size="sm" variant="ghost">Pause</Button></div>
    </Card>
    <SectionHeader title="Feature unlocks" subtitle="Turn on concepts as your child is ready"/>
    <Card pad="md" style={{display:'flex',flexDirection:'column',gap:16}}>
      <Switch checked={interest} onChange={setInterest} label="Savings interest" description="Maya earns 5% a year, compounded monthly."/>
      <Switch checked={loans} onChange={setLoans} label="Loans" description="You can lend Maya money with a payment plan."/>
      <Switch checked={credit} onChange={setCredit} label="Credit card simulation" description="Maya can charge purchases and pay interest on what she carries."/>
    </Card>
  </div>;
}

function LoansTab(){
  return <div style={{display:'flex',flexDirection:'column',gap:16,maxWidth:640}}>
    <div style={{display:'flex',justifyContent:'flex-end'}}><Button size="sm" icon="plus">New loan</Button></div>
    <LoanCard title="Skateboard loan" principalCents={4000} remainingCents={2600} ratePct={4} nextPayment={500} nextDue="Fri"/>
    <EmptyState icon="credit-card" title="No credit card set up" style={{padding:'32px 0'}}>
      Turn on credit simulation in Rules to let Maya practice a revolving balance.
    </EmptyState>
  </div>;
}

function KidDetail({kid,onBack}){
  const [tab,setTab]=React.useState('Accounts');
  const [showDeposit,setShowDeposit]=React.useState(false);
  const [amt,setAmt]=React.useState('5.00');
  return <div>
    <AppHeader mode="parent" subtitle="Parent mode" title={kid.name} onBack={onBack}
      actions={<IconButton icon="more-horizontal" label="More" variant="onBrand" size="sm"/>}/>
    <div style={{padding:'24px 28px',maxWidth:960,margin:'0 auto'}}>
      <Tabs items={['Accounts','Activity','Rules','Loans']} value={tab} onChange={setTab} style={{marginBottom:22}}/>
      {tab==='Accounts'&&<AccountsTab kid={kid} onDeposit={()=>setShowDeposit(true)}/>}
      {tab==='Activity'&&<Card pad="sm">{TXNS.map((t,i)=><TransactionRow key={i} {...t} divider={i<TXNS.length-1}/>)}</Card>}
      {tab==='Rules'&&<RulesTab/>}
      {tab==='Loans'&&<LoansTab/>}
    </div>
    <Dialog open={showDeposit} title={'Deposit to '+kid.name+"'s spending"} onClose={()=>setShowDeposit(false)}
      footer={<><Button variant="secondary" fullWidth onClick={()=>setShowDeposit(false)}>Cancel</Button><Button fullWidth onClick={()=>setShowDeposit(false)}>Deposit</Button></>}>
      <MoneyInput value={amt} onChange={setAmt} presets={[5,10,20,50]}/>
      <Input label="Note (optional)" placeholder="e.g. Birthday money" style={{marginTop:14}}/>
    </Dialog>
  </div>;
}

function ParentApp(){
  const [kid,setKid]=React.useState(null);
  return <div data-theme="parent" style={{background:'var(--surface-page)',minHeight:'100%'}}>
    {kid?<KidDetail kid={kid} onBack={()=>setKid(null)}/>:<FamilyDashboard onSelectKid={setKid}/>}
  </div>;
}
window.ParentApp=ParentApp;
