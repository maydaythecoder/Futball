// SECURITY: Role-based access control utilities
import { UserRole } from "@/lib/types";
import { hasPermission, Permission } from "./permissions";

/**
 * Check if a user role can perform an action on a resource
 */
export function canPerformAction(
  role: UserRole,
  action: "read" | "create" | "update" | "delete",
  resource: string
): boolean {
  const permission = action === "read" ? "read" : "write";
  
  if (action === "delete" && role !== "admin") {
    return false;
  }

  if (resource === "users" && role !== "admin") {
    return false;
  }

  if (resource === "training" && action === "create") {
    return hasPermission(role, "write:training");
  }

  if (resource === "injuries" && action === "create") {
    return hasPermission(role, "write:injuries");
  }

  return hasPermission(role, permission as Permission);
}

/**
 * Check if a user can access a specific route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  if (route.startsWith("/dashboard/admin")) {
    return role === "admin";
  }

  // All authenticated users can access other dashboard routes
  return true;
}

/**
 * Get allowed actions for a role on a resource
 */
export function getAllowedActions(
  role: UserRole,
  resource: string
): Array<"read" | "create" | "update" | "delete"> {
  const actions: Array<"read" | "create" | "update" | "delete"> = [];

  if (canPerformAction(role, "read", resource)) actions.push("read");
  if (canPerformAction(role, "create", resource)) actions.push("create");
  if (canPerformAction(role, "update", resource)) actions.push("update");
  if (canPerformAction(role, "delete", resource)) actions.push("delete");

  return actions;
}

