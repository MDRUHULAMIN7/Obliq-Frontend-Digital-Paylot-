export const queryKeys = {
  authUser: ['auth', 'me'] as const,
  users: (role?: string) => ['users', role ?? 'all'] as const,
  userPermissions: (id: string) => ['users', id, 'permissions'] as const,
  auditLogs: (filters?: Record<string, string | number | undefined>) =>
    ['audit', filters ?? {}] as const,
};
