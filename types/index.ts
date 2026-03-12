export type Role = 'admin' | 'manager' | 'agent' | 'customer';

export type Status = 'active' | 'suspended' | 'banned';

export type PermissionAtom =
  | 'dashboard:view'
  | 'leads:view'
  | 'leads:create'
  | 'leads:edit'
  | 'leads:delete'
  | 'tasks:view'
  | 'tasks:create'
  | 'tasks:edit'
  | 'tasks:delete'
  | 'reports:view'
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:suspend'
  | 'users:ban'
  | 'audit:view'
  | 'settings:view'
  | 'customer_portal:view';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  permissions: PermissionAtom[];
  createdBy?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuditLog {
  _id: string;
  action: string;
  performedBy: User;
  targetUser?: User;
  details: string;
  createdAt: string;
}
