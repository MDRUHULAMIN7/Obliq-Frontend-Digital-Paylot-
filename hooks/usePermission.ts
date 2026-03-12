'use client';

import useAuth from './useAuth';
import type { PermissionAtom } from '../types';

export default function usePermission() {
  const { user } = useAuth();

  const hasPermission = (permission: PermissionAtom) => {
    if (!user) {
      return false;
    }
    if (user.role === 'admin') {
      return true;
    }
    return user.permissions.includes(permission);
  };

  return { hasPermission };
}
