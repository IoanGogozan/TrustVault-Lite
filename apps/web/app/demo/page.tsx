"use client";

import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileUp,
  FolderPlus,
  Key,
  KeyRound,
  Link2,
  LockKeyhole,
  LogOut,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

type Role = "owner" | "admin" | "member" | "viewer" | "auditor";
type Classification = "public" | "internal" | "confidential" | "restricted";

type Membership = {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  role: Role;
  mfaRequired: boolean;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  memberships: Membership[];
};

type Project = {
  id: string;
  tenantId: string;
  name: string;
  classification: Classification;
  createdBy: string;
  createdAt: string;
};

type DocumentRecord = {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  classification: Classification;
  createdBy: string;
  createdAt: string;
};

type AuditEvent = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorType: string;
  result: "success" | "failure";
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type SecurityAlert = {
  id: string;
  severity: "info" | "low" | "medium" | "high";
  title: string;
  status: "clear" | "monitor" | "attention";
};

type SecurityDashboard = {
  metrics: {
    mfaRequiredMembers: number;
    activeMembers: number;
    accessDeniedEvents: number;
    cleanFiles: number;
    pendingFiles: number;
    blockedFiles: number;
    activeApiKeys: number;
    activeShareLinks: number;
    riskyEvents: number;
  };
  alerts: SecurityAlert[];
  riskyEvents: AuditEvent[];
};

type ShareLink = {
  id: string;
  tenantId: string;
  documentId: string;
  permission: "download";
  expiresAt: string;
  maxDownloads?: number;
  downloadCount: number;
  revokedAt?: string;
  createdBy: string;
  createdAt: string;
};

type ApiKeyScope = "documents:read" | "documents:write" | "audit:read";

type ApiKeyRecord = {
  id: string;
  tenantId: string;
  name: string;
  keyPrefix: string;
  scopes: ApiKeyScope[];
  expiresAt?: string;
  lastUsedAt?: string;
  revokedAt?: string;
  createdBy: string;
  createdAt: string;
};

type DownloadMetadata = {
  documentId?: string;
  versionId?: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  expiresInSeconds: number;
  expiresAt: string;
};

type FeedbackArea = "login" | "project" | "document" | "download" | "share" | "apiKey";
type Feedback = Partial<Record<FeedbackArea, string>>;
type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string };

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
const demoAccounts = [
  { email: "owner@acme.test", label: "Acme Owner — full demo access" },
  { email: "admin@acme.test", label: "Acme Admin — project administration" },
  { email: "member@acme.test", label: "Acme Member — document contributor" },
  { email: "viewer@acme.test", label: "Acme Viewer — read-only boundary" },
  { email: "auditor@acme.test", label: "Acme Auditor — security visibility" },
  { email: "owner@globex.test", label: "Globex Owner — separate tenant" }
] as const;

export default function Home() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();
  const [loginEmail, setLoginEmail] = useState("owner@acme.test");
  const [projectName, setProjectName] = useState("Vendor Evidence");
  const [projectClassification, setProjectClassification] = useState<Classification>("internal");
  const [documentTitle, setDocumentTitle] = useState("Vendor Security Review");
  const [apiKeyName, setApiKeyName] = useState("Portfolio Read Integration");
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [securityDashboard, setSecurityDashboard] = useState<SecurityDashboard | undefined>();
  const [downloadMetadata, setDownloadMetadata] = useState<DownloadMetadata | undefined>();
  const [lastShareToken, setLastShareToken] = useState<string | undefined>();
  const [lastApiKey, setLastApiKey] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<Feedback>({});

  const selectedMembership = useMemo(
    () =>
      currentUser?.memberships.find((membership) => membership.tenantId === selectedTenantId) ??
      currentUser?.memberships[0],
    [currentUser?.memberships, selectedTenantId]
  );
  const role = selectedMembership?.role;
  const canCreateProject = role === "owner" || role === "admin";
  const canCreateDocument = role === "owner" || role === "admin" || role === "member";
  const canCreateApiKey = role === "owner";
  const canRevokeApiKey = role === "owner";
  const canViewSecurity = role === "owner" || role === "admin" || role === "auditor";
  const canViewAudit = canViewSecurity;

  function report(area: FeedbackArea, message?: string) {
    setFeedback((current) => ({ ...current, [area]: message }));
  }

  function canReadDocument(document: DocumentRecord) {
    return document.classification !== "restricted" || role === "owner" || role === "admin" || role === "auditor";
  }

  function canUpdateDocument(document: DocumentRecord) {
    return (role === "owner" || role === "admin" || role === "member") &&
      (document.classification !== "restricted" || role === "owner" || role === "admin");
  }

  useEffect(() => {
    if (!selectedMembership) {
      setProjects([]);
      setDocuments([]);
      setAuditEvents([]);
      setShareLinks([]);
      setApiKeys([]);
      setSecurityDashboard(undefined);
      return;
    }

    clearTransientUiState();
    void refreshWorkspace(selectedMembership.tenantId);
  }, [selectedMembership?.tenantId]);

  function clearTransientUiState() {
    setFeedback({});
    setDownloadMetadata(undefined);
    setLastShareToken(undefined);
    setLastApiKey(undefined);
  }

  async function refreshCurrentUser() {
    const response = await fetch(`${apiBaseUrl}/me`, {
      credentials: "include"
    });

    if (!response.ok) {
      setCurrentUser(undefined);
      setSelectedTenantId(undefined);
      return;
    }

    const payload = (await response.json()) as {
      user: Omit<CurrentUser, "memberships">;
      memberships: Membership[];
    };
    const nextUser = {
      ...payload.user,
      memberships: payload.memberships
    };

    setCurrentUser(nextUser);
    setSelectedTenantId((currentTenantId) => currentTenantId ?? nextUser.memberships[0]?.tenantId);
  }

  async function refreshWorkspace(tenantId: string) {
    const [
      projectResponse,
      documentResponse,
      shareLinkResponse,
      apiKeyResponse,
      auditResponse,
      securityDashboardResponse
    ] = await Promise.all([
      apiGet<{ projects: Project[] }>("/projects", tenantId),
      apiGet<{ documents: DocumentRecord[] }>("/documents", tenantId),
      apiGet<{ shareLinks: ShareLink[] }>("/share-links", tenantId),
      apiGet<{ apiKeys: ApiKeyRecord[] }>("/api-keys", tenantId),
      apiGet<{ auditEvents: AuditEvent[] }>("/audit-events", tenantId),
      apiGet<SecurityDashboard>("/security-dashboard", tenantId)
    ]);

    if (projectResponse) {
      setProjects(projectResponse.projects);
      setSelectedProjectId((currentProjectId) => currentProjectId ?? projectResponse.projects[0]?.id);
    }

    if (documentResponse) {
      setDocuments(documentResponse.documents);
    }

    if (shareLinkResponse) {
      setShareLinks(shareLinkResponse.shareLinks);
    }

    if (apiKeyResponse) {
      setApiKeys(apiKeyResponse.apiKeys);
    }

    setAuditEvents(auditResponse?.auditEvents ?? []);
    setSecurityDashboard(securityDashboardResponse);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearTransientUiState();

    const response = await fetch(`${apiBaseUrl}/auth/dev-login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail })
    });

    if (!response.ok) {
      report("login", await responseErrorMessage(response));
      return;
    }

    await refreshCurrentUser();
  }

  async function handleLogout() {
    await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: csrfHeaders()
    });
    setCurrentUser(undefined);
    setSelectedTenantId(undefined);
    setSelectedProjectId(undefined);
    clearTransientUiState();
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedMembership) {
      return;
    }

    report("project", undefined);
    const response = await apiPost<{ project: Project }>("/projects", selectedMembership.tenantId, {
      name: projectName,
      classification: projectClassification
    });

    if (!response.ok) {
      report("project", response.message);
      return;
    }

    setSelectedProjectId(response.data.project.id);
    report("project", "Project created.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleCreateDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedMembership || !selectedProjectId) {
      return;
    }

    report("document", undefined);
    const documentResponse = await apiPost<{ document: DocumentRecord }>(
      "/documents",
      selectedMembership.tenantId,
      {
        title: documentTitle,
        projectId: selectedProjectId,
        classification: "confidential"
      }
    );

    if (!documentResponse.ok) {
      report("document", documentResponse.message);
      return;
    }

    const content = "%PDF-demo evidence";
    const versionResponse = await apiPost(`/documents/${documentResponse.data.document.id}/versions`, selectedMembership.tenantId, {
      originalFilename: "vendor-evidence.pdf",
      mimeType: "application/pdf",
      sizeBytes: content.length,
      contentBase64: btoa(content)
    });
    if (!versionResponse.ok) {
      report("document", versionResponse.message);
      return;
    }
    const scanResponse = await apiPost(
      `/documents/${documentResponse.data.document.id}/scan`,
      selectedMembership.tenantId,
      {}
    );

    if (!scanResponse.ok) {
      report("document", scanResponse.message);
      return;
    }
    report("document", "Synthetic PDF uploaded and scanned server-side.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handlePrepareDownload(documentId: string) {
    if (!selectedMembership) {
      return;
    }

    const response = await apiGet<{ download: DownloadMetadata }>(
      `/documents/${documentId}/download`,
      selectedMembership.tenantId
    );

    if (!response) {
      report("download", "Download is unavailable for this role or document.");
      return;
    }

    setDownloadMetadata(response.download);
    const contentResponse = await fetch(`${apiBaseUrl}/documents/${documentId}/download/content`, {
      credentials: "include",
      headers: { "X-Tenant-Id": selectedMembership.tenantId }
    });

    if (!contentResponse.ok) {
      report("download", await responseErrorMessage(contentResponse));
      await refreshWorkspace(selectedMembership.tenantId);
      return;
    }

    await saveDownloadResponse(contentResponse, response.download.originalFilename);
    report("download", "Download started.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleCreateShareLink(documentId: string) {
    if (!selectedMembership) {
      return;
    }

    const response = await apiPost<{ shareLink: ShareLink; shareToken: string }>(
      "/share-links",
      selectedMembership.tenantId,
      {
        documentId,
        expiresInMinutes: 60,
        maxDownloads: 3
      }
    );

    if (!response.ok) {
      report("share", response.message);
      return;
    }

    setLastShareToken(response.data.shareToken);
    report("share", "Share link created.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleUseShareLink() {
    if (!lastShareToken || !selectedMembership) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/public/share-links/${lastShareToken}/download`, {
      credentials: "omit"
    });

    if (!response.ok) {
      report("share", await responseErrorMessage(response));
      await refreshWorkspace(selectedMembership.tenantId);
      return;
    }

    await saveDownloadResponse(response, "shared-document");
    report("share", "Share link download started.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleRevokeShareLink(shareLinkId: string) {
    if (!selectedMembership) {
      return;
    }

    const response = await apiDelete(`/share-links/${shareLinkId}`, selectedMembership.tenantId);

    if (!response.ok) {
      report("share", response.message);
      return;
    }

    report("share", "Share link revoked.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleCreateApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedMembership) {
      return;
    }

    const response = await apiPost<{ apiKey: ApiKeyRecord; key: string }>(
      "/api-keys",
      selectedMembership.tenantId,
      {
        name: apiKeyName,
        scopes: ["documents:read"],
        expiresInDays: 30
      }
    );

    if (!response.ok) {
      report("apiKey", response.message);
      return;
    }

    setLastApiKey(response.data.key);
    report("apiKey", "API key created. Copy it now; it is shown only once.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleUseApiKey() {
    if (!lastApiKey || !selectedMembership) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/documents`, {
      headers: { Authorization: `Bearer ${lastApiKey}` }
    });

    if (!response.ok) {
      report("apiKey", await responseErrorMessage(response));
      await refreshWorkspace(selectedMembership.tenantId);
      return;
    }

    report("apiKey", "External API request succeeded.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function handleRevokeApiKey(apiKeyId: string) {
    if (!selectedMembership) {
      return;
    }

    const response = await apiDelete(`/api-keys/${apiKeyId}`, selectedMembership.tenantId);

    if (!response.ok) {
      report("apiKey", response.message);
      return;
    }

    report("apiKey", "API key revoked.");
    await refreshWorkspace(selectedMembership.tenantId);
  }

  async function apiGet<T>(path: string, tenantId: string): Promise<T | undefined> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      credentials: "include",
      headers: { "X-Tenant-Id": tenantId }
    });

    return response.ok ? ((await response.json()) as T) : undefined;
  }

  async function apiPost<T>(path: string, tenantId: string, body: unknown): Promise<ApiResult<T>> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...csrfHeaders(),
        "X-Tenant-Id": tenantId
      },
      body: JSON.stringify(body)
    });

    return response.ok
      ? { ok: true, data: (await response.json()) as T }
      : { ok: false, message: await responseErrorMessage(response) };
  }

  async function apiDelete(path: string, tenantId: string): Promise<ApiResult<undefined>> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "DELETE",
      credentials: "include",
      headers: { ...csrfHeaders(), "X-Tenant-Id": tenantId }
    });

    return response.ok
      ? { ok: true, data: undefined }
      : { ok: false, message: await responseErrorMessage(response) };
  }

  if (!currentUser) {
    return (
      <main className="login-shell">
        <form className="login-panel" aria-label="Demo login" onSubmit={handleLogin}>
          <div className="brand-mark">
            <ShieldCheck aria-hidden="true" />
          </div>
          <div>
            <h1>TrustVault Lite</h1>
            <p>Secure client evidence portal</p>
          </div>
          {demoMode ? (
            <div className="sandbox-notice">
              <strong>Public security sandbox</strong>
              <span>Synthetic data only. State resets when the application restarts.</span>
              <span>Do not upload personal, confidential, or production data.</span>
            </div>
          ) : null}
          <label className="field">
            <span>Seeded demo identity</span>
            <select
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            >
              {demoAccounts.map((account) => (
                <option key={account.email} value={account.email}>{account.label}</option>
              ))}
            </select>
          </label>
          {feedback.login ? <p className="status-message" role="status">{feedback.login}</p> : null}
          <button className="primary-action" type="submit">
            <KeyRound aria-hidden="true" />
            Demo login
          </button>
          <p className="login-privacy-note">
            This demo uses strictly necessary session and security cookies. Network information and
            demo actions may be processed for security, abuse prevention, and audit purposes. Use
            synthetic data only. <Link href="/privacy">Read the Privacy Notice.</Link>
          </p>
          <Link className="back-to-landing" href="/">
            ← About this security demo
          </Link>
        </form>
      </main>
    );
  }

  if (!selectedMembership) {
    return (
      <main className="login-shell">
        <section className="login-panel" aria-label="No tenant access">
          <div className="brand-mark">
            <ShieldCheck aria-hidden="true" />
          </div>
          <div>
            <h1>No active tenant</h1>
            <p>This sandbox account has no active seeded tenant.</p>
          </div>
          <button className="primary-action" type="button" onClick={handleLogout}>
            <LogOut aria-hidden="true" />
            Log out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <ShieldCheck aria-hidden="true" />
          <span>TrustVault</span>
        </div>
        <nav>
          <Link className="nav-item" href="/">
            <ShieldCheck aria-hidden="true" />
            About demo
          </Link>
          <a className="nav-item active" href="#evidence">
            <FileUp aria-hidden="true" />
            Evidence
          </a>
          <a className="nav-item" href="#audit">
            <Activity aria-hidden="true" />
            Audit
          </a>
          <a className="nav-item" href="#api-keys">
            <Key aria-hidden="true" />
            API keys
          </a>
          <a className="nav-item" href="#security">
            <AlertTriangle aria-hidden="true" />
            Security
          </a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Tenant workspace</p>
            <h1>{selectedMembership.tenantName}</h1>
          </div>
          <div className="topbar-actions">
            <label>
              <span>Tenant</span>
              <select
                value={selectedMembership.tenantId}
                onChange={(event) => setSelectedTenantId(event.target.value)}
              >
                {currentUser.memberships.map((membership) => (
                  <option key={membership.tenantId} value={membership.tenantId}>
                    {membership.tenantName}
                  </option>
                ))}
              </select>
            </label>
            <button className="icon-action" type="button" onClick={handleLogout}>
              <LogOut aria-hidden="true" />
              <span className="sr-only">Log out</span>
            </button>
          </div>
        </header>

        {demoMode ? (
          <section className="sandbox-banner" aria-label="Sandbox notice">
            <div>
              <strong>Controlled, ephemeral security demo</strong>
              <span>Synthetic data only · single instance · resets on restart</span>
            </div>
            <span>Current role: {formatRole(selectedMembership.role)}</span>
          </section>
        ) : null}

        <section className="demo-guide" aria-labelledby="demo-guide-title">
          <div className="demo-guide-copy">
            <p className="eyebrow">Security controls demonstrated</p>
            <h2 id="demo-guide-title">Follow the evidence trail</h2>
            <p>
              Tenant isolation · RBAC/ABAC · RLS defense-in-depth · CSRF · secure sessions ·
              hashed API keys · private file delivery · audit logging
            </p>
          </div>
          <div className="demo-steps">
            <button className="guide-step" type="button" onClick={() => void handleLogout()}>
              <strong>1</strong>
              <span>Switch role and observe denied access</span>
            </button>
            <a className="guide-step" href="#evidence">
              <strong>2</strong>
              <span>Upload and scan a synthetic document</span>
            </a>
            <a className="guide-step" href="#api-keys">
              <strong>3</strong>
              <span>Create and revoke an API key or share link</span>
            </a>
          </div>
        </section>

        <section className="summary-grid" aria-label="Security summary">
          {buildSecuritySignals(securityDashboard, canViewSecurity).map((signal) => {
            const Icon = signal.icon;

            return (
              <article className="metric" key={signal.label}>
                <Icon aria-hidden="true" />
                <div>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </div>
              </article>
            );
          })}
        </section>

        <section className="content-grid" id="evidence">
          <article className="panel">
            <div className="panel-heading">
              <h2>Create project</h2>
              <FolderPlus aria-hidden="true" />
            </div>
            <form className="stack-form" onSubmit={handleCreateProject}>
              <label className="field">
                <span>Project name</span>
                <input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                />
              </label>
              <label className="field">
                <span>Classification</span>
                <select
                  value={projectClassification}
                  onChange={(event) =>
                    setProjectClassification(event.target.value as Classification)
                  }
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="confidential">Confidential</option>
                  <option value="restricted">Restricted</option>
                </select>
              </label>
              <button className="secondary-action" type="submit" disabled={!canCreateProject}>
                <FolderPlus aria-hidden="true" />
                Create project
              </button>
              {!canCreateProject ? <p className="role-guidance">Owner or Admin role required.</p> : null}
              {feedback.project ? <p className="status-message" role="status">{feedback.project}</p> : null}
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <h2>Upload document</h2>
              <FileUp aria-hidden="true" />
            </div>
            <form className="stack-form" onSubmit={handleCreateDocument}>
              <label className="field">
                <span>Project</span>
                <select
                  value={selectedProjectId ?? ""}
                  onChange={(event) => setSelectedProjectId(event.target.value)}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Document title</span>
                <input
                  value={documentTitle}
                  onChange={(event) => setDocumentTitle(event.target.value)}
                />
              </label>
              <button className="secondary-action" type="submit" disabled={!selectedProjectId || !canCreateDocument}>
                <FileUp aria-hidden="true" />
                Upload PDF
              </button>
              {!canCreateDocument ? <p className="role-guidance">Owner, Admin, or Member role required.</p> : null}
              {feedback.document ? <p className="status-message" role="status">{feedback.document}</p> : null}
            </form>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <h2>Projects</h2>
              <Building2 aria-hidden="true" />
            </div>
            <div className="record-list">
              {projects.map((project) => (
                <button
                  className="record-row"
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <span>{project.name}</span>
                  <strong>{formatClassification(project.classification)}</strong>
                </button>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <h2>Documents</h2>
              <CheckCircle2 aria-hidden="true" />
            </div>
            <div className="record-list">
              {documents.map((document) => (
                <div className="record-row passive document-row" key={document.id}>
                  <div>
                    <span>{document.title}</span>
                    <small>{formatClassification(document.classification)}</small>
                  </div>
                  <button
                    className="compact-action"
                    type="button"
                    disabled={!canReadDocument(document)}
                    title={!canReadDocument(document) ? "This role cannot download restricted documents" : undefined}
                    onClick={() => void handlePrepareDownload(document.id)}
                  >
                    Prepare download
                  </button>
                  <button
                    className="compact-action"
                    type="button"
                    disabled={!canUpdateDocument(document)}
                    title={!canUpdateDocument(document) ? "Document update permission required" : undefined}
                    onClick={() => void handleCreateShareLink(document.id)}
                  >
                    Create link
                  </button>
                </div>
              ))}
            </div>
            {downloadMetadata ? (
              <dl className="details compact">
                <div>
                  <dt>File</dt>
                  <dd>{downloadMetadata.originalFilename}</dd>
                </div>
                <div>
                  <dt>Expires</dt>
                  <dd>{new Date(downloadMetadata.expiresAt).toLocaleTimeString()}</dd>
                </div>
              </dl>
            ) : null}
            {feedback.download ? <p className="status-message" role="status">{feedback.download}</p> : null}
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <h2>Share links</h2>
              <Link2 aria-hidden="true" />
            </div>
            {lastShareToken ? (
              <div className="token-box">
                <span>One-time token</span>
                <code>{lastShareToken}</code>
                <button className="compact-action" type="button" onClick={() => void handleUseShareLink()}>
                  Use public link
                </button>
              </div>
            ) : null}
            <div className="record-list">
              {shareLinks.map((shareLink) => (
                <div className="record-row passive document-row" key={shareLink.id}>
                  <div>
                    <span>{shareLink.revokedAt ? "Revoked link" : "Active link"}</span>
                    <small>
                      {shareLink.downloadCount}
                      {shareLink.maxDownloads ? `/${shareLink.maxDownloads}` : ""} downloads
                    </small>
                  </div>
                  <button
                    className="compact-action"
                    type="button"
                    disabled={Boolean(shareLink.revokedAt) || !(role === "owner" || role === "admin" || role === "member")}
                    onClick={() => void handleRevokeShareLink(shareLink.id)}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
            {feedback.share ? <p className="status-message" role="status">{feedback.share}</p> : null}
          </article>

          <article className="panel" id="api-keys">
            <div className="panel-heading">
              <h2>API keys</h2>
              <Key aria-hidden="true" />
            </div>
            <form className="stack-form" onSubmit={handleCreateApiKey}>
              <label className="field">
                <span>Key name</span>
                <input
                  value={apiKeyName}
                  onChange={(event) => setApiKeyName(event.target.value)}
                />
              </label>
              <button className="secondary-action" type="submit" disabled={!canCreateApiKey}>
                <Key aria-hidden="true" />
                Create read key
              </button>
              {!canCreateApiKey ? <p className="role-guidance">Owner role required to create API keys.</p> : null}
            </form>
            {lastApiKey ? (
              <div className="token-box">
                <span>One-time API key</span>
                <code>{lastApiKey}</code>
                <button className="compact-action" type="button" onClick={() => void handleUseApiKey()}>
                  Call external API
                </button>
              </div>
            ) : null}
            <div className="record-list">
              {apiKeys.map((apiKey) => (
                <div className="record-row passive document-row" key={apiKey.id}>
                  <div>
                    <span>{apiKey.name}</span>
                    <small>
                      {apiKey.keyPrefix} - {apiKey.scopes.join(", ")}
                    </small>
                  </div>
                  <button
                    className="compact-action"
                    type="button"
                    disabled={Boolean(apiKey.revokedAt) || !canRevokeApiKey}
                    onClick={() => void handleRevokeApiKey(apiKey.id)}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
            {feedback.apiKey ? <p className="status-message" role="status">{feedback.apiKey}</p> : null}
          </article>

          <article className="panel" id="security">
            <div className="panel-heading">
              <h2>Security dashboard</h2>
              <ShieldCheck aria-hidden="true" />
            </div>
            {!canViewSecurity ? <p className="role-guidance">Security metrics require Owner, Admin, or Auditor role.</p> : null}
            {canViewSecurity ? <dl className="details compact">
              <div>
                <dt>MFA coverage</dt>
                <dd>
                  {securityDashboard
                    ? `${securityDashboard.metrics.mfaRequiredMembers}/${securityDashboard.metrics.activeMembers}`
                    : "Loading"}
                </dd>
              </div>
              <div>
                <dt>File scans</dt>
                <dd>
                  {securityDashboard
                    ? `${securityDashboard.metrics.cleanFiles} clean, ${securityDashboard.metrics.pendingFiles} pending, ${securityDashboard.metrics.blockedFiles} blocked`
                    : "No data"}
                </dd>
              </div>
            </dl> : null}
            <div className="record-list">
              {securityDashboard?.alerts.map((alert) => (
                <div className="record-row passive alert-row" key={alert.id}>
                  <AlertTriangle aria-hidden="true" />
                  <div>
                    <span>{alert.title}</span>
                    <small>
                      {alert.severity} - {alert.status}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="audit">
            <div className="panel-heading">
              <h2>Audit events</h2>
              <Activity aria-hidden="true" />
            </div>
            {!canViewAudit ? <p className="role-guidance">Audit events require Owner, Admin, or Auditor role.</p> : null}
            {canViewAudit ? <div className="audit-list">
              {auditEvents.map((event) => (
                <div className="audit-row" key={event.id}>
                  <span className={`result-dot ${event.result}`} />
                  <div>
                    <strong>{event.action}</strong>
                    <span>{event.entityType}</span>
                  </div>
                  <time>{new Date(event.createdAt).toLocaleTimeString()}</time>
                </div>
              ))}
            </div> : null}
          </article>

          <article className="panel">
            <div className="panel-heading">
              <h2>Risky events</h2>
              <AlertTriangle aria-hidden="true" />
            </div>
            {!canViewSecurity ? <p className="role-guidance">Risky events require Owner, Admin, or Auditor role.</p> : null}
            {canViewSecurity ? <div className="audit-list">
              {securityDashboard?.riskyEvents.map((event) => (
                <div className="audit-row" key={event.id}>
                  <span className={`result-dot ${event.result}`} />
                  <div>
                    <strong>{event.action}</strong>
                    <span>
                      {event.actorType} - {event.entityType}
                    </span>
                  </div>
                  <time>{new Date(event.createdAt).toLocaleTimeString()}</time>
                </div>
              ))}
            </div> : null}
          </article>

        </section>
      </section>
    </main>
  );
}

function formatRole(role: Role): string {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatClassification(classification: Classification): string {
  return classification.charAt(0).toUpperCase() + classification.slice(1);
}

async function responseErrorMessage(response: Response): Promise<string> {
  const errorMessages: Record<string, string> = {
    permission_denied: "Access denied: your current role does not allow this action.",
    session_required: "Your demo session expired. Log in again to continue.",
    csrf_token_invalid: "The security token expired. Log in again to refresh the session.",
    project_name_required: "Enter a project name.",
    api_key_name_required: "Enter an API key name.",
    document_not_available_for_sharing: "Only clean, scanned documents can be shared.",
    document_not_available_for_download: "The document is not ready for download.",
    rate_limit_exceeded: "Too many requests. Wait briefly and try again."
  };

  try {
    const payload = (await response.json()) as { error?: string };
    const knownMessage = payload.error ? errorMessages[payload.error] : undefined;
    if (knownMessage) {
      return knownMessage;
    }
  } catch {
    // A proxy or empty response may not contain a JSON error body.
  }

  if (response.status === 401) return "Your demo session expired. Log in again to continue.";
  if (response.status === 403) return "Access denied by the backend security policy.";
  if (response.status === 404) return "The requested demo resource was not found.";
  if (response.status === 409) return "The action conflicts with the current demo state.";
  if (response.status === 429) return "Too many requests. Wait briefly and try again.";
  return `The request failed (${response.status}).`;
}

async function saveDownloadResponse(response: Response, fallbackFilename: string): Promise<void> {
  const blob = await response.blob();
  const filename = filenameFromContentDisposition(response.headers.get("content-disposition")) ?? fallbackFilename;
  const objectUrl = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  window.document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

function filenameFromContentDisposition(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const encodedFilename = /filename\*=UTF-8''([^;]+)/i.exec(value)?.[1];

  if (encodedFilename) {
    return decodeURIComponent(encodedFilename);
  }

  return /filename="([^"]+)"/i.exec(value)?.[1];
}

function csrfHeaders(): Record<string, string> {
  const csrfToken = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("tv_csrf="))
    ?.split("=")[1];

  return csrfToken ? { "X-CSRF-Token": csrfToken } : {};
}

function buildSecuritySignals(securityDashboard: SecurityDashboard | undefined, canViewSecurity: boolean) {
  return [
    {
      label: "MFA",
      value: !canViewSecurity
        ? "Restricted"
        : securityDashboard
        ? `${securityDashboard.metrics.mfaRequiredMembers}/${securityDashboard.metrics.activeMembers}`
        : "Loading",
      icon: LockKeyhole
    },
    {
      label: "Denied",
      value: canViewSecurity ? String(securityDashboard?.metrics.accessDeniedEvents ?? 0) : "Restricted",
      icon: AlertTriangle
    },
    {
      label: "API keys",
      value: canViewSecurity ? String(securityDashboard?.metrics.activeApiKeys ?? 0) : "Restricted",
      icon: Key
    },
    {
      label: "Share links",
      value: canViewSecurity ? String(securityDashboard?.metrics.activeShareLinks ?? 0) : "Restricted",
      icon: Link2
    }
  ];
}
