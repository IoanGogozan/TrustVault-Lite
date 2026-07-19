# Processing Record

Controller: Ioan Gogozan, Norway
Privacy contact: `privacy@norvix.no`
Scope: TrustVault Lite public portfolio site and synthetic security sandbox

| Processing | Data | Purpose | Legal basis | Maximum retention |
| --- | --- | --- | --- | --- |
| Website access logs | IP address, path, time, status, basic user-agent data | Security and troubleshooting | GDPR Art. 6(1)(f) | 7 days |
| Demo sessions | Session and CSRF identifiers | Login and request security | GDPR Art. 6(1)(f) | 8 hours or logout |
| Sandbox activity | Seeded identity, actions, labels, pseudonymised IP-derived identifier, user agent | Operate the demo, enforce controls, prevent abuse, and demonstrate auditability | GDPR Art. 6(1)(f) | 24 hours |
| Email enquiries | Email address and message | Respond to privacy or technical enquiries | GDPR Art. 6(1)(f) | 12 months after resolution |

## Recipients and location

- The application is self-hosted in Norway.
- Cloudflare provides authoritative DNS only and does not proxy HTTP traffic for `vault.norvix.no`.
- Personal data is not sold, used for advertising, or used for analytics/profiling.

## Technical enforcement

- Cookie `Max-Age` is 28,800 seconds.
- A systemd timer force-recreates the API daily, deleting its in-memory state and container log.
- Caddy rotates the site access log every 24 hours and retains rotated logs for no more than 168 hours.
- The UI restricts login to seeded identities and warns against entering real data.

Review this record whenever cookies, analytics, infrastructure, logging, authentication, or retention changes.
