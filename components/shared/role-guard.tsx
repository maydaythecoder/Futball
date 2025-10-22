"use client";

import { ReactNode } from "react";
import { UserRole } from "@/lib/types";
import { DEFAULT_MOCK_USER } from "@/lib/mock-data/users";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user role
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const currentUser = DEFAULT_MOCK_USER;

  if (!allowedRoles.includes(currentUser.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

