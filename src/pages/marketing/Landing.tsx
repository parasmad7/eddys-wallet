import { useNavigate } from 'react-router-dom';
import { Button, Card, Icon, Badge, StatTile, BalanceCard, GoalCard } from '../../design-system/components';
import './Landing.css';

const HOW_IT_WORKS = [
  {
    icon: 'users',
    title: 'Parent sets up the family',
    body: "Create a free account, add your kids, and choose how much starts in each wallet.",
  },
  {
    icon: 'wallet',
    title: 'Child gets their wallet',
    body: 'Each kid logs in with their own simple PIN and sees a wallet that’s all theirs.',
  },
  {
    icon: 'sparkles',
    title: 'Watch them learn',
    body: 'Every deposit, save, and spend becomes a lesson — in real time, on every device.',
  },
];

const FEATURES = [
  { icon: 'wallet', title: 'Virtual wallet', body: 'A running balance that’s just for teaching — never touches a real bank account or card.' },
  { icon: 'percent', title: 'Savings interest', body: 'Turn on interest so saving actually pays off, just like a real bank account.' },
  { icon: 'target', title: 'Savings goals', body: 'Kids set goals, track progress, and feel the win the moment they hit them.' },
  { icon: 'repeat', title: 'Recurring allowance', body: 'Set it once and allowance shows up automatically, every week, like clockwork.' },
  { icon: 'refresh-cw', title: 'Real-time sync', body: 'Deposit on your phone and your kid sees it on their tablet in seconds.' },
  { icon: 'smartphone', title: 'Works on any device', body: 'Phone, tablet, laptop, or school Chromebook — install it like an app, no store required.' },
];

const STAGES = [
  { icon: 'wallet', title: 'Start', body: 'A simple balance. Money comes in, money goes out — the child sees exactly where it went.', locked: false },
  { icon: 'piggy-bank', title: 'Savings', body: 'Saving means choosing not to spend now. Add interest and goals when they’re ready.', locked: false },
  { icon: 'hand-coins', title: 'Borrowing', body: 'Borrowing costs more than you take — a real loan, real payments, real interest.', locked: true },
  { icon: 'credit-card', title: 'Credit', body: 'A credit card lets you spend money you don’t have. Learn what that costs, safely.', locked: true },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Nav() {
  const navigate = useNavigate();
  return (
    <div className="landing-nav">
      <div className="landing-container landing-nav-inner">
        <a className="landing-nav-logo" href="#top">
          <img src="/assets/logo.svg" alt="Eddy's Wallet" />
        </a>
        <div className="landing-nav-links">
          <div className="landing-nav-links-desktop">
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToId('how-it-works'); }}>
              How it works
            </a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToId('features'); }}>
              Features
            </a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToId('pricing'); }}>
              Pricing
            </a>
          </div>
          <Button size="sm" onClick={() => navigate('/login')}>
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="landing-hero" id="top">
      <div className="landing-container landing-hero-inner">
        <div className="landing-hero-copy">
          <Badge tone="brand" icon="sparkles">
            Virtual money. Real lessons.
          </Badge>
          <h1>Teach your kids about money — without real money.</h1>
          <p>
            Give your kid a virtual wallet, not a bank account. They start with a balance and grow into saving,
            borrowing, and credit as they’re ready — all guided by you, all completely free.
          </p>
          <div className="landing-hero-actions">
            <Button size="lg" iconAfter="arrow-right" onClick={() => navigate('/login')}>
              Get started
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollToId('how-it-works')}>
              See how it works
            </Button>
          </div>
        </div>
        <div className="landing-hero-visual">
          <img className="landing-hero-mascot" src="/assets/eddy-mascot.svg" alt="Eddy the piggy bank mascot" />
          <div className="landing-hero-card">
            <div className="landing-hero-card-head">
              <img src="/assets/logo-mark.svg" alt="" />
              <div>
                <div className="eyebrow">Maya's spending</div>
                <div className="name">Eddy's Wallet</div>
              </div>
            </div>
            <div className="landing-hero-card-amount">$12.40</div>
            <div className="landing-hero-card-pill">
              <Icon name="calendar-check" size={13} />
              +$5.00 next Friday
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="landing-section" id="how-it-works">
      <div className="landing-container">
        <div className="landing-section-header">
          <h2>Three steps to your kid’s first lesson</h2>
          <p>No bank forms, no waiting period. You’re set up before the kettle boils.</p>
        </div>
        <div className="how-it-works-track">
          {HOW_IT_WORKS.map((step, i) => (
            <div className="how-it-works-step" key={step.title}>
              <div className="how-it-works-badge">
                <Icon name={step.icon} size={28} />
                <span className="how-it-works-number">{i + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <span className="how-it-works-arrow">
                  <Icon name="arrow-right" size={22} />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="landing-section landing-section-alt" id="features">
      <div className="landing-container">
        <div className="landing-section-header">
          <h2>Everything a family needs, nothing it doesn’t</h2>
          <p>Built for the MVP of financial literacy — not a full bank, on purpose.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <Card key={f.title} tone="plain" pad="lg" className="feature-card">
              <div className="feature-icon">
                <Icon name={f.icon} size={22} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearningProgression() {
  return (
    <div className="landing-section" id="curriculum">
      <div className="landing-container">
        <div className="landing-section-header">
          <h2>The curriculum grows with your kid</h2>
          <p>Four stages, unlocked by you — never all at once. Start simple, add complexity as they’re ready.</p>
        </div>
        <div className="progression-track">
          {STAGES.map((s, i) => (
            <div className={`progression-item${s.locked ? ' is-locked' : ''}`} key={s.title}>
              <div className="progression-dot">
                <Icon name={s.locked ? 'lock' : s.icon} size={24} />
              </div>
              <h4>
                {i + 1}. {s.title}
              </h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeComparison() {
  return (
    <div className="landing-section landing-section-alt" id="modes">
      <div className="landing-container">
        <div className="landing-section-header">
          <h2>One app, two very different worlds</h2>
          <p>Kid mode is playful and colorful. Parent mode is calm and in control. Same wallet, different lens.</p>
        </div>
        <div className="mode-compare">
          <div className="mode-panel" data-theme="kid">
            <div className="mode-panel-frame">
              <div style={{ background: 'var(--mode-header)', padding: 'var(--space-4)', color: '#fff' }}>
                <div style={{ font: 'var(--weight-bold) var(--text-xs)/1.2 var(--font-body)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', opacity: 0.75, marginBottom: 4 }}>
                  Kid mode
                </div>
                <div style={{ font: 'var(--type-title)' }}>Hey, Maya!</div>
              </div>
              <div className="mode-panel-body">
                <BalanceCard kind="spending" cents={1240} note="+$5.00 next Friday" noteIcon="calendar-check" />
                <GoalCard name="New headphones" targetCents={4000} currentCents={2400} deadline="Aug 2026" icon="headphones" />
              </div>
            </div>
            <div className="mode-panel-caption">
              <h3>Kid mode</h3>
              <p>Big rounded shapes, grape and tangerine color, playful icons. The balance and goals come first.</p>
            </div>
          </div>

          <div className="mode-panel" data-theme="parent">
            <div className="mode-panel-frame">
              <div style={{ background: 'var(--mode-header)', padding: 'var(--space-4)', color: '#fff' }}>
                <div style={{ font: 'var(--weight-bold) var(--text-xs)/1.2 var(--font-body)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', opacity: 0.75, marginBottom: 4 }}>
                  Parent mode
                </div>
                <div style={{ font: 'var(--weight-bold) var(--text-xl)/1.2 var(--font-display)' }}>Family dashboard</div>
              </div>
              <div className="mode-panel-body">
                <div className="mode-parent-nav">
                  <span className="mode-parent-tab active">Dashboard</span>
                  <span className="mode-parent-tab">Deposit</span>
                  <span className="mode-parent-tab">Settings</span>
                </div>
                <div className="mode-stat-grid">
                  <StatTile label="Total balance" cents={4820} icon="wallet" tone="grape" />
                  <StatTile label="This month" text="+$62.00" icon="trending-up" tone="mint" />
                </div>
              </div>
            </div>
            <div className="mode-panel-caption">
              <h3>Parent mode</h3>
              <p>Denser, calmer, and built for oversight — deposit, adjust settings, and see every kid at a glance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pricing() {
  const navigate = useNavigate();
  return (
    <div className="landing-section" id="pricing">
      <div className="landing-container">
        <div className="pricing-card">
          <Badge tone="accent" icon="heart">
            For families
          </Badge>
          <h2 style={{ marginTop: 'var(--space-4)' }}>Free. Seriously.</h2>
          <div className="price">$0</div>
          <p>No subscription, no in-app purchases, no fine print. Eddy’s Wallet is virtual money — it costs nothing to teach with it.</p>
          <ul className="pricing-features">
            <li>
              <Icon name="check" size={15} /> Unlimited kids
            </li>
            <li>
              <Icon name="check" size={15} /> Every feature unlocked
            </li>
            <li>
              <Icon name="check" size={15} /> No bank account needed
            </li>
          </ul>
          <Button size="lg" variant="accent" icon="arrow-right" onClick={() => navigate('/login')}>
            Create your family
          </Button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="landing-footer">
      <div className="landing-container">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <img src="/assets/logo.svg" alt="Eddy's Wallet" />
            <p>A virtual wallet that teaches kids how money really works, one stage at a time.</p>
          </div>
          <div className="landing-footer-cols">
            <div className="landing-footer-col">
              <h4>Product</h4>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToId('how-it-works'); }}>
                How it works
              </a>
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToId('features'); }}>
                Features
              </a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToId('pricing'); }}>
                Pricing
              </a>
            </div>
            <div className="landing-footer-col">
              <h4>Company</h4>
              <a href="https://github.com/parasmad7/eddys-wallet" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId('top'); }}>
                Back to top
              </a>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2026 Eddy’s Wallet. Virtual money only — not a bank.</span>
          <span className="landing-footer-love">
            Built with <Icon name="heart" size={13} color="var(--danger)" /> for financial literacy
          </span>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="landing">
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <LearningProgression />
      <ModeComparison />
      <Pricing />
      <Footer />
    </div>
  );
}
