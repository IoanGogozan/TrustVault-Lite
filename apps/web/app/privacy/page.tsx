import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="privacy-shell">
      <nav className="privacy-nav">
        <Link className="landing-brand" href="/">
          <ShieldCheck aria-hidden="true" />
          <span>TrustVault Lite</span>
        </Link>
        <Link className="privacy-back" href="/">
          <ArrowLeft aria-hidden="true" /> Back to overview
        </Link>
      </nav>

      <article className="privacy-document">
        <header className="privacy-header">
          <p className="landing-kicker">Privacy and data protection</p>
          <h1>Privacy Notice</h1>
          <p>Last updated: 19 July 2026</p>
        </header>

        <section>
          <h2>1. Who operates this website</h2>
          <p>
            TrustVault Lite is operated by Ioan Gogozan, Norway. The operator is the data controller
            for the personal data described in this notice.
          </p>
          <p>Privacy contact: <a href="mailto:privacy@norvix.no">privacy@norvix.no</a></p>
        </section>

        <section>
          <h2>2. About TrustVault Lite</h2>
          <p>
            TrustVault Lite is a public portfolio and backend-security demonstration. It is a
            controlled, ephemeral sandbox and is not a production SaaS service.
          </p>
          <aside>
            The sandbox is exclusively for synthetic demonstration data. Do not enter personal,
            confidential, sensitive, regulated, or production information.
          </aside>
        </section>

        <section>
          <h2>3. Personal data that may be processed</h2>
          <p>When you visit or use the website, the following information may be processed:</p>
          <ul>
            <li>network and request information, including IP address, time, path, response status, and basic user-agent information;</li>
            <li>session and security identifiers stored in strictly necessary cookies;</li>
            <li>pseudonymised identifiers derived from IP addresses for security audit events;</li>
            <li>the seeded demo identity you select and actions performed in the sandbox;</li>
            <li>text entered into demo fields, such as project names, document titles, and API-key labels;</li>
            <li>information you provide if you contact the operator by email.</li>
          </ul>
          <p>The sandbox does not create real customer accounts. Demonstrated PDF content is synthetic.</p>
        </section>

        <section>
          <h2>4. Why the information is processed</h2>
          <p>Information is processed to:</p>
          <ul>
            <li>operate the website and interactive sandbox;</li>
            <li>establish and protect authenticated sessions;</li>
            <li>prevent abuse, excessive requests, and unauthorized access;</li>
            <li>enforce tenant and authorization boundaries and create security audit events;</li>
            <li>troubleshoot errors, maintain security, and respond to enquiries.</li>
          </ul>
          <p>
            The legal basis is GDPR Article 6(1)(f), legitimate interests. Those interests are
            operating and securing the portfolio demonstration, preventing misuse, and demonstrating
            verifiable backend-security controls.
          </p>
        </section>

        <section>
          <h2>5. Strictly necessary cookies</h2>
          <p>The interactive sandbox uses only these first-party cookies:</p>
          <div className="privacy-table-wrap">
            <table>
              <thead><tr><th>Cookie</th><th>Purpose</th><th>Maximum lifetime</th></tr></thead>
              <tbody>
                <tr><td><code>tv_session</code></td><td>Maintains the authenticated server-side demo session.</td><td>8 hours or logout</td></tr>
                <tr><td><code>tv_csrf</code></td><td>Protects authenticated requests against cross-site request forgery.</td><td>8 hours or logout</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            These cookies are necessary for login and security functionality. The website does not
            use advertising, profiling, analytics, or third-party tracking cookies, so no consent
            banner is displayed.
          </p>
        </section>

        <section>
          <h2>6. Retention</h2>
          <ul>
            <li>Session and CSRF cookies: maximum 8 hours or until logout.</li>
            <li>Sandbox state and in-memory audit events: deleted by the scheduled daily API reset, no later than 24 hours after creation.</li>
            <li>Caddy access logs containing network information: maximum 7 days.</li>
            <li>Privacy or technical email correspondence: up to 12 months after the enquiry is resolved, unless longer retention is necessary for a legal claim.</li>
          </ul>
          <p>
            Data may be deleted earlier during restart, maintenance, or abuse mitigation. The sandbox
            provides no data recovery or backup guarantee.
          </p>
        </section>

        <section>
          <h2>7. Infrastructure and recipients</h2>
          <p>
            The application is self-hosted on infrastructure in Norway. Cloudflare provides
            authoritative DNS in DNS-only mode; website and API traffic connects directly to the
            Caddy origin and is not proxied through Cloudflare.
          </p>
          <p>
            Personal data is not sold or shared with advertisers. Information may be disclosed to
            infrastructure, email, or security providers only where necessary to operate or protect
            the service, or where required by law.
          </p>
        </section>

        <section>
          <h2>8. Your rights</h2>
          <p>Depending on the circumstances, you may have the right to:</p>
          <ul>
            <li>request access, correction, deletion, or restriction;</li>
            <li>object to processing based on legitimate interests;</li>
            <li>receive information about the source and use of your data;</li>
            <li>complain to the Norwegian Data Protection Authority, Datatilsynet.</li>
          </ul>
          <p>
            Some security records are pseudonymous. You may need to provide an approximate access
            time and IP address so a relevant record can be located. Contact
            {" "}<a href="mailto:privacy@norvix.no">privacy@norvix.no</a> to exercise your rights.
          </p>
        </section>

        <section>
          <h2>9. Automated controls</h2>
          <p>
            The website does not perform profiling or automated decisions with legal or similarly
            significant effects. Automated rate limits may temporarily reject excessive requests to
            protect the service.
          </p>
        </section>

        <section>
          <h2>10. Security</h2>
          <p>
            The service uses transport encryption, secure cookies, request-origin validation, CSRF
            protection, rate limiting, access controls, and log redaction. No internet service can
            guarantee absolute security. Do not submit information requiring confidentiality,
            persistence, or recovery.
          </p>
        </section>

        <section>
          <h2>11. Changes to this notice</h2>
          <p>
            This notice may be updated when the application, infrastructure, or processing practices
            change. The current version and update date will remain published here.
          </p>
        </section>
      </article>
    </main>
  );
}
