const {Button,Icon,Badge,Card}=window.EddySWalletDesignSystem_93be68;

const STAGES=[
  {icon:'wallet',title:'Start',body:'A simple balance. Money comes in, money goes out — the child sees exactly where it went.'},
  {icon:'piggy-bank',title:'Savings',body:'Saving means choosing not to spend now. Add interest and goals when they\u2019re ready.'},
  {icon:'hand-coins',title:'Borrowing',body:'Borrowing costs more than you take — a real loan, real payments, real interest.'},
  {icon:'credit-card',title:'Credit',body:'A credit card lets you spend money you don\u2019t have. Learn what that costs, safely.'}
];
const FEATURES=[
  {icon:'refresh-cw',title:'Real-time everywhere',body:'Deposit on your phone, your kid sees it on their tablet in seconds.'},
  {icon:'shield-check',title:'No real money, ever',body:'Nothing touches a bank account or a card. It\u2019s a teaching tool, not a bank.'},
  {icon:'sliders-horizontal',title:'You set the pace',body:'Turn on interest, loans, and credit only when your child is ready for each.'},
  {icon:'smartphone',title:'Works on everything',body:'Phone, tablet, laptop, school Chromebook — install it like an app, no store required.'}
];

function Nav(){
  return <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 48px',maxWidth:1280,margin:'0 auto'}}>
    <img src="../../assets/logo.svg" height="32" alt="Eddy's Wallet"/>
    <div style={{display:'flex',gap:28,alignItems:'center'}}>
      <a href="#how" style={{color:'var(--text-body)'}}>How it works</a>
      <a href="#features" style={{color:'var(--text-body)'}}>Features</a>
      <Button size="sm">Get started</Button>
    </div>
  </div>;
}

function Hero(){
  return <div style={{background:'linear-gradient(180deg,var(--grape-50),var(--surface-card))',padding:'56px 48px 40px'}}>
    <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'1.1fr 0.9fr',gap:48,alignItems:'center'}}>
      <div>
        <Badge tone="brand" icon="sparkles">Virtual money. Real lessons.</Badge>
        <h1 style={{font:'var(--weight-heavy) 56px/1.05 var(--font-display)',color:'var(--text-strong)',margin:'18px 0 16px'}}>Allowance that teaches money, one stage at a time.</h1>
        <p style={{font:'var(--weight-medium) 19px/1.55 var(--font-body)',color:'var(--text-body)',maxWidth:480,marginBottom:28}}>
          Give your kid a virtual wallet, not a bank account. They start with a balance — and grow into saving, borrowing, and credit as they're ready.
        </p>
        <div style={{display:'flex',gap:14}}>
          <Button size="lg" iconAfter="arrow-right">Start free</Button>
          <Button size="lg" variant="secondary">See how it works</Button>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'center'}}>
        <div style={{background:'linear-gradient(160deg,var(--grape-500),var(--grape-700))',borderRadius:'var(--radius-2xl)',
          padding:32,width:300,color:'#fff',boxShadow:'var(--shadow-xl)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <img src="../../assets/eddy-mascot.svg" width="44" height="44" alt=""/>
            <div><div style={{opacity:.8,font:'var(--type-caption)'}}>Maya's spending</div><div style={{font:'var(--weight-bold) 15px/1 var(--font-body)'}}>Eddy's Wallet</div></div>
          </div>
          <div style={{font:'var(--weight-heavy) 48px/1 var(--font-money)'}}>$12.40</div>
          <div style={{marginTop:10,display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.18)',
            borderRadius:'var(--radius-pill)',padding:'6px 12px',font:'var(--weight-bold) 12px/1 var(--font-body)'}}>
            <Icon name="calendar-check" size={13}/>+$5.00 next Friday
          </div>
        </div>
      </div>
    </div>
  </div>;
}

function HowItWorks(){
  return <div id="how" style={{padding:'64px 48px',maxWidth:1280,margin:'0 auto'}}>
    <h2 style={{textAlign:'center',font:'var(--weight-bold) 34px/1.2 var(--font-display)',color:'var(--text-strong)',marginBottom:8}}>The curriculum grows with your kid</h2>
    <p style={{textAlign:'center',color:'var(--text-muted)',font:'var(--type-body)',maxWidth:560,margin:'0 auto 40px'}}>Four stages, unlocked by you — never all at once.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
      {STAGES.map((s,i)=><Card key={s.title} tone={i===0?'tint':'plain'} pad="lg" style={{textAlign:'center'}}>
        <div style={{width:56,height:56,margin:'0 auto 16px',borderRadius:'var(--radius-lg)',background:'var(--brand-soft)',
          color:'var(--brand-strong)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={s.icon} size={26}/></div>
        <div style={{font:'var(--type-section)',color:'var(--text-strong)',marginBottom:6}}>{i+1}. {s.title}</div>
        <div style={{font:'var(--type-body)',color:'var(--text-muted)'}}>{s.body}</div>
      </Card>)}
    </div>
  </div>;
}

function Features(){
  return <div id="features" style={{padding:'56px 48px 72px',background:'var(--surface-sunken)'}}>
    <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24}}>
      {FEATURES.map(f=><div key={f.title} style={{display:'flex',gap:16}}>
        <div style={{width:48,height:48,flex:'none',borderRadius:'var(--radius-md)',background:'var(--surface-card)',
          boxShadow:'var(--shadow-sm)',color:'var(--brand-strong)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={f.icon} size={22}/></div>
        <div><div style={{font:'var(--type-section)',color:'var(--text-strong)',marginBottom:4}}>{f.title}</div>
        <div style={{font:'var(--type-body)',color:'var(--text-muted)'}}>{f.body}</div></div>
      </div>)}
    </div>
  </div>;
}

function CTA(){
  return <div style={{background:'linear-gradient(160deg,var(--grape-600),var(--grape-800))',padding:'56px 48px',textAlign:'center',color:'#fff'}}>
    <h2 style={{font:'var(--weight-heavy) 34px/1.2 var(--font-display)',marginBottom:10}}>Set up in five minutes. Free, forever.</h2>
    <p style={{opacity:.85,marginBottom:24,font:'var(--type-body)'}}>No bank account. No debit card. Just a wallet that teaches.</p>
    <Button size="lg" variant="accent" icon="arrow-right">Create your family</Button>
  </div>;
}

function Footer(){
  return <div style={{padding:'28px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',maxWidth:1280,margin:'0 auto',color:'var(--text-faint)',font:'var(--type-caption)'}}>
    <span>© 2026 Eddy's Wallet. Virtual money only — not a bank.</span>
    <div style={{display:'flex',gap:18}}><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
  </div>;
}

function Marketing(){
  return <div style={{background:'var(--surface-card)'}}>
    <Nav/><Hero/><HowItWorks/><Features/><CTA/><Footer/>
  </div>;
}
window.Marketing=Marketing;
