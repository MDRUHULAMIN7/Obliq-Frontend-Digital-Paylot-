'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageWrapper from '../../../components/layout/PageWrapper';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PermissionEditor from '../../../components/users/PermissionEditor';
import useAuth from '../../../hooks/useAuth';
import usePermission from '../../../hooks/usePermission';
import { api } from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import { PERMISSIONS } from '../../../lib/permissions';
import type { ApiResponse, User } from '../../../types';

const pageSize = 10;

export default function UsersPage() {
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users(roleFilter || undefined),
    queryFn: async () => {
      const response = await api.get<ApiResponse<User[]>>('/users', {
        params: { role: roleFilter || undefined },
      });
      return response.data.data;
    },
  });

  const users = data ?? [];

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query),
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedUsers = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const currentUserPermissions =
    user?.role === 'admin' ? PERMISSIONS : user?.permissions ?? [];

  const suspendMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ApiResponse<User>>(
        `/users/${id}/suspend`,
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('User suspended');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to suspend user'),
  });

  const banMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ApiResponse<User>>(`/users/${id}/ban`);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('User banned');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to ban user'),
  });

  const roleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge variant="purple">Admin</Badge>;
      case 'manager':
        return <Badge variant="blue">Manager</Badge>;
      case 'agent':
        return <Badge variant="green">Agent</Badge>;
      default:
        return <Badge variant="gray">Customer</Badge>;
    }
  };

  const statusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="green">Active</Badge>;
      case 'suspended':
        return <Badge variant="yellow">Suspended</Badge>;
      default:
        return <Badge variant="red">Banned</Badge>;
    }
  };

  return (
    <PageWrapper title="Users">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="md:max-w-xs"
          />
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-orange-100 px-3 py-2 text-sm"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="agent">Agent</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-2xl bg-orange-50"
              />
            ))}
          </div>
        ) : pagedUsers.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-orange-200 p-6 text-center text-sm text-slate-500">
            No users found.
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-orange-100 pb-3 text-xs font-semibold uppercase text-slate-400">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Permissions</span>
              <span>Actions</span>
            </div>
            {pagedUsers.map((row) => (
              <div
                key={row._id}
                onClick={() => setSelectedUser(row)}
                className="grid cursor-pointer grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4 rounded-2xl border border-orange-100 px-4 py-3 text-sm transition hover:border-orange-200"
              >
                <span className="font-semibold text-slate-900">{row.name}</span>
                <span className="text-slate-500">{row.email}</span>
                {roleBadge(row.role)}
                {statusBadge(row.status)}
                <span className="text-slate-500">
                  {row.permissions?.length ?? 0}
                </span>
                <div
                  className="relative"
                  onClick={(event) => event.stopPropagation()}
                >
                  <details className="group">
                    <summary className="cursor-pointer list-none text-xs font-semibold text-orange-600">
                      Actions
                    </summary>
                    <div className="absolute right-0 z-10 mt-2 w-40 rounded-2xl border border-orange-100 bg-white p-2 text-xs shadow-lg">
                      {hasPermission('users:view') && (
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                          onClick={() => setSelectedUser(row)}
                        >
                          View Permissions
                        </button>
                      )}
                      {hasPermission('users:edit') && (
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                        >
                          Edit
                        </button>
                      )}
                      {hasPermission('users:suspend') && (
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                          onClick={() => suspendMutation.mutate(row._id)}
                        >
                          Suspend
                        </button>
                      )}
                      {hasPermission('users:ban') && (
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                          onClick={() => banMutation.mutate(row._id)}
                        >
                          Ban
                        </button>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {selectedUser ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Permissions
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedUser.name} · {selectedUser.email}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-slate-400 hover:text-orange-600"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
            <PermissionEditor
              user={selectedUser}
              currentUserPermissions={currentUserPermissions}
              canEdit={hasPermission('users:edit')}
              onSave={(updated) => setSelectedUser(updated)}
            />
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
}
