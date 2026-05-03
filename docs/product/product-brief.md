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
- CI/CD security pipeline;
- clear demo script.

## Core Capabilities

- Create organization.
- Invite members.
- Tenant switcher.
- Projects.
- Secure document upload.
- File scan status.
- Secure download.
- Expiring share links.
- RBAC and ABAC.
- Scoped API keys.
- Audit log viewer.
- Security dashboard.
- Support access with controlled and logged break-glass workflow.

## Roles

| Role | Permissions |
| --- | --- |
| Owner | Manages the tenant, mock billing, security settings, and members |
| Admin | Manages projects, documents, invitations, and audit visibility |
| Member | Uploads and downloads documents in projects they can access |
| Viewer | Read-only access |
| Auditor | Read-only access plus audit logs, no changes |
| Support Operator | Internal role with no default access to tenant data |

## Key Principle

Authentication tells the system who the user is. Authorization decides what that user may do in the current tenant.

Every request must pass through centralized access control and default to deny.

