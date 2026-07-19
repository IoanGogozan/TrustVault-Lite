import {
  ArrowRight,
  Braces,
  Check,
  Database,
  Eye,
  FileCheck2,
  Github,
  KeyRound,
  LockKeyhole,
  Network,
  RefreshCcw,
  ScanSearch,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import Link from "next/link";

const controls = [
  {
    icon: Network,
    title: "Tenant isolation",
    text: "Tenant-scoped repositories, membership enforcement, object-level authorization, and a separately tested PostgreSQL RLS path."
  },
  {
    icon: ShieldCheck,
    title: "RBAC + ABAC",
    text: "A centralized deny-by-default policy layer enforces role, tenant, project, action, and resource boundaries."
  },
  {
    icon: LockKeyhole,
    title: "Secure sessions",
    text: "Server-side sessions use HttpOnly, Secure, SameSite cookies with origin validation, CSRF tokens, and revocation."
  },
  {
    icon: FileCheck2,
    title: "Private file delivery",
    text: "Synthetic PDFs pass validation and mock scan states before authenticated or share-link proxy downloads are allowed."
  },
  {
    icon: KeyRound,
    title: "Hashed credentials",
    text: "API keys and share-link secrets are high entropy, stored as hashes, displayed once, scoped, expiring, and revocable."
  },
  {
    icon: Eye,
    title: "Auditability",
    text: "Security-relevant successes and denials feed tenant-scoped audit views and a compact security dashboard."
  }
];

const walkthrough = [
  {
    number: "01",
    title: "Switch identity",
    text: "Compare Owner, Viewer, Auditor, and a separate Globex tenant. Try an action outside the selected role and observe the denial."
  },
  {
    number: "02",
    title: "Exercise the file boundary",
    text: "Create a project, upload the generated synthetic PDF, trigger the authenticated mock scan, and download only after it is clean."
  },
  {
    number: "03",
    title: "Control delegated access",
    text: "Create and revoke a scoped API key or expiring share link, then inspect the resulting audit events and security signals."
  }
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="Primary navigation">
        <Link className="landing-brand" href="/">
          <ShieldCheck aria-hidden="true" />
          <span>TrustVault Lite</span>
        </Link>
        <div className="landing-nav-actions">
          <span className="live-status"><i />Live portfolio sandbox</span>
          <a
            className="landing-text-link"
            href="https://github.com/IoanGogozan/TrustVault-Lite"
            rel="noreferrer"
            target="_blank"
          >
            <Github aria-hidden="true" />
            Source
          </a>
          <Link className="landing-nav-cta" href="/demo">
            Open demo
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-kicker"><span>Backend security demonstration</span> · Portfolio project</p>
          <h1>Security controls you can<br />actually exercise.</h1>
          <p className="landing-lede">
            TrustVault Lite is a controlled multi-tenant evidence portal built to demonstrate backend
            authorization, tenant isolation, secure sessions, private file delivery, delegated access,
            and audit logging—not to collect real customer data.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-primary-cta" href="/demo">
              Launch interactive demo
              <ArrowRight aria-hidden="true" />
            </Link>
            <a className="landing-secondary-cta" href="#walkthrough">See the walkthrough</a>
          </div>
          <div className="landing-trust-line" aria-label="Demo boundaries">
            <span><Check />No registration</span>
            <span><Check />Seeded identities</span>
            <span><RefreshCcw />State resets daily</span>
          </div>
        </div>

        <div className="architecture-card" aria-label="Live request architecture">
          <div className="architecture-card-head">
            <div>
              <span className="terminal-dots"><i /><i /><i /></span>
              <strong>request-path.txt</strong>
            </div>
            <span>LIVE TOPOLOGY</span>
          </div>
          <div className="architecture-flow">
            <div className="architecture-node node-client"><Braces /><span>Browser</span><small>same-origin client</small></div>
            <ArrowRight className="flow-arrow" />
            <div className="architecture-node"><ShieldCheck /><span>Caddy reverse proxy</span><small>TLS · headers · routing</small></div>
            <ArrowRight className="flow-arrow" />
            <div className="architecture-node node-api"><TerminalSquare /><span>Fastify API</span><small>authn · authz · audit</small></div>
          </div>
          <div className="architecture-branches">
            <div><Database /><span>In-memory sandbox</span><small>active runtime</small></div>
            <div><ScanSearch /><span>Mock scan queue</span><small>state enforcement</small></div>
          </div>
          <div className="architecture-log">
            <span>$</span> deny by default · trust one proxy hop · expose no storage keys
          </div>
        </div>
      </section>

      <section className="landing-section controls-section" id="controls">
        <div className="landing-section-heading">
          <p className="landing-kicker">Security controls demonstrated</p>
          <h2>Designed around boundaries,<br />not security slogans.</h2>
          <p>Each control is visible in the UI, enforced by the API, and backed by negative tests.</p>
        </div>
        <div className="control-grid">
          {controls.map(({ icon: Icon, title, text }) => (
            <article className="control-card" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section walkthrough-section" id="walkthrough">
        <div className="landing-section-heading compact-heading">
          <p className="landing-kicker">Three-minute walkthrough</p>
          <h2>Follow the security story.</h2>
          <p>The demo is seeded so a reviewer can reach meaningful controls immediately.</p>
        </div>
        <div className="walkthrough-list">
          {walkthrough.map((step) => (
            <article className="walkthrough-step" key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
        <Link className="landing-primary-cta walkthrough-cta" href="/demo">
          Start with Owner at Acme Corp
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className="landing-section scope-section">
        <div className="scope-copy">
          <p className="landing-kicker">Deliberate scope</p>
          <h2>A security sandbox,<br />not a production SaaS.</h2>
          <p>
            The project demonstrates secure design decisions while keeping operations intentionally
            small, inspectable, and disposable. These limits are documented—not hidden.
          </p>
        </div>
        <div className="scope-columns">
          <div className="scope-column implemented-scope">
            <span>Implemented now</span>
            <ul>
              <li><Check />Single hardened API instance</li>
              <li><Check />Tenant-scoped in-memory runtime</li>
              <li><Check />PostgreSQL/RLS integration tests</li>
              <li><Check />Synthetic PDF and mock scanning</li>
              <li><Check />CI and security workflows</li>
            </ul>
          </div>
          <div className="scope-column extension-scope">
            <span>Documented extensions</span>
            <ul>
              <li>OIDC, MFA, and passkeys</li>
              <li>Redis-backed distributed state</li>
              <li>S3-compatible object storage</li>
              <li>ClamAV or equivalent scanning</li>
              <li>Durable, multi-instance operation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="landing-final-cta">
        <div>
          <p className="landing-kicker">Ready to inspect it?</p>
          <h2>Break a permission boundary.<br />Then find the evidence.</h2>
        </div>
        <div>
          <Link className="landing-primary-cta light-cta" href="/demo">
            Open the sandbox
            <ArrowRight aria-hidden="true" />
          </Link>
          <p>Synthetic data only · No account required · Ephemeral state</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand"><ShieldCheck /><span>TrustVault Lite</span></div>
        <p>ASVS-inspired backend security demonstration by Ioan Gogozan.</p>
        <div className="landing-footer-links">
          <Link href="/privacy">Privacy</Link>
          <a href="https://github.com/IoanGogozan/TrustVault-Lite" rel="noreferrer" target="_blank">
            View source <ArrowRight />
          </a>
        </div>
      </footer>
    </main>
  );
}
