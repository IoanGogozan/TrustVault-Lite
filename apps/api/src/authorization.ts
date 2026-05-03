import type { Action, Resource, Role } from "@trustvault/authz";
import { can } from "@trustvault/authz";
import { redactAuditMetadata } from "@trustvault/audit";
import { randomUUID, createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AppStore, MembershipRole } from "./domain.js";

export type AuthorizationTarget = Resource & {
  entityType: string;
  entityId?: string;
};

export async function requirePermission(
  store: AppStore,
  request: FastifyRequest,
  reply: FastifyReply,
  action: Action,
  resource?: AuthorizationTarget
): Promise<boolean> {
  if (!request.tenantContext) {
    await reply.code(500).send({ error: "tenant_context_required" });
    return false;
  }

  const actor = {
    id: request.tenantContext.user.id,
    tenantId: request.tenantContext.tenant.id,
    role: toAuthzRole(request.tenantContext.membership.role),
    membershipStatus: request.tenantContext.membership.status,
    ...(request.tenantContext.membership.projectIds
      ? { projectIds: request.tenantContext.membership.projectIds }
      : {})
  };

  const decision = can(actor, action, resource);

  if (decision.allowed) {
    return true;
  }

  store.auditEvents.push({
    id: `audit_${randomUUID()}`,
    tenantId: request.tenantContext.tenant.id,
    actorUserId: request.tenantContext.user.id,
    actorType: "user",
    action: "authorization.denied",
    entityType: resource?.entityType ?? "unknown",
    ...(resource?.entityId ? { entityId: resource.entityId } : {}),
    result: "failure",
    ipHash: hashIp(request.ip),
    userAgent: request.headers["user-agent"] ?? "unknown",
    metadata: redactAuditMetadata({
      requestedAction: action,
      reason: decision.reason,
      resourceTenantId: resource?.tenantId,
      resourceProjectId: resource?.projectId
    }),
    createdAt: new Date()
  });

  await reply.code(403).send({ error: "permission_denied" });
  return false;
}

function toAuthzRole(role: MembershipRole): Role {
  return role;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}
