# Product Brief: TrustVault Lite

## Problem

Small teams need a secure workspace where they can centralize confidential documents, compliance evidence, contracts, and reports without exposing data across customers or roles.

TrustVault Lite demonstrates how to build a small multi-tenant SaaS with security designed from day one.

## Target Audience

- B2B startups preparing for audits or due diligence.
- Small compliance, legal, and customer success teams.
- Technical evaluators who want to see real security controls in a portfolio project.

## Portfolio Goal

The project should demonstrate technical maturity through the combination of:

- working application;
- threat model;
- architecture diagram;
- ASVS mapping;
- security tests;
- audit logs;
- CI and security pipeline;
- clear demo script.

## Implemented Demo Capabilities

- Seeded organizations, memberships, and roles. Organization and invitation creation exist for local tests but are disabled in the public sandbox.
- Tenant switcher.
- Projects.
- Synthetic PDF upload through base64 JSON.
- Authenticated server-side mock scan status.
- Secure download.
- Expiring share links.
- RBAC and ABAC.
- Scoped API keys.
- Audit log viewer.
- Security dashboard.

## Roles

| Role | Permissions |
| --- | --- |
| Owner | Manages the tenant, members, API keys, share links, and security visibility |
| Admin | Manages projects, documents, invitations, and audit visibility |
| Member | Uploads and downloads documents in projects they can access |
| Viewer | Read-only access |
| Auditor | Read-only access plus audit logs, no changes |

## Key Principle

Authentication tells the system who the user is. Authorization decides what that user may do in the current tenant.

Every request must pass through centralized access control and default to deny.
