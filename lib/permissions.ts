import type { PermissionAtom } from '../types';

export const PERMISSIONS: PermissionAtom[] = [
  'dashboard:view',
  'leads:view',
  'leads:create',
  'leads:edit',
  'leads:delete',
  'tasks:view',
  'tasks:create',
  'tasks:edit',
  'tasks:delete',
  'reports:view',
  'users:view',
  'users:create',
  'users:edit',
  'users:suspend',
  'users:ban',
  'audit:view',
  'settings:view',
  'customer_portal:view',
];

export const PERMISSION_GROUPS: Record<string, PermissionAtom[]> = {
  Dashboard: ['dashboard:view'],
  Leads: ['leads:view', 'leads:create', 'leads:edit', 'leads:delete'],
  Tasks: ['tasks:view', 'tasks:create', 'tasks:edit', 'tasks:delete'],
  Reports: ['reports:view'],
  Users: ['users:view', 'users:create', 'users:edit', 'users:suspend', 'users:ban'],
  Audit: ['audit:view'],
  Settings: ['settings:view'],
  'Customer Portal': ['customer_portal:view'],
};
