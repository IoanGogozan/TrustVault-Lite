# Legitimate Interest Assessment

Processing covered: essential website operation, authenticated demo sessions, abuse prevention, rate limiting, troubleshooting, and security audit events.

## Purpose test

The interests are legitimate and specific: operate and secure a public portfolio demonstration, prevent misuse, investigate technical/security events, and demonstrate verifiable backend-security controls.

## Necessity test

Limited network metadata, necessary session identifiers, and security-event records are required to deliver the interactive sandbox and protect it against unauthorized or excessive requests. The project uses no analytics, advertising, profiling, or real customer accounts. A seeded-identity dropdown avoids collecting arbitrary login email addresses.

## Balancing test

The impact on visitors is limited because:

- the site prominently prohibits personal, confidential, sensitive, regulated, or production data;
- cookies are first-party, strictly necessary, and expire within eight hours or at logout;
- sandbox state is deleted by a daily reset;
- access logs are deleted after no more than seven days;
- audit records store a pseudonymised IP-derived identifier rather than the raw IP;
- no information is sold, used for advertising, or used for profiling;
- a public privacy notice explains processing and rights.

Visitors may reasonably expect essential security logging and session processing when voluntarily launching an authenticated public security sandbox. On balance, the limited processing does not override the visitor's interests, rights, or freedoms.

Decision: rely on GDPR Article 6(1)(f) for the processing above. Reassess before introducing analytics, third-party embeds, durable accounts, real uploads, broader monitoring, or new recipients.

## Official references

- [Datatilsynet: legitimate-interest balancing](https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/om-behandlingsgrunnlag/nodvendig-for-a-ivareta-legitime-interesser---interesseavveiing/)
- [Datatilsynet: information and transparency](https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/informasjon-og-apenhet/hva-skal-virksomheten-gi-informasjon-om/)
- [Nkom: cookies and the strictly necessary exemption](https://nkom.no/internett/informasjonskapsler-cookies)
