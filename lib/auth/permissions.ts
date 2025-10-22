// SECURITY: Permission definitions for role-based access control
import { UserRole } from "@/lib/types";

export type Permission =
  | "read"
  | "write"
  | "delete"
  | "manage_users"
  | "write:training"
  | "write:injuries";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ["read", "write", "delete", "manage_users"],
  scout: ["read", "write"],
  coach: ["read", "write:training", "write:injuries"],
};

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a user role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a user role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

