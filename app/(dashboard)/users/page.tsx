'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AxiosError } from 'axios';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    role: 'agent',
  });

  const urlState = useMemo(() => {
    const pageParam = Number(searchParams.get('page') ?? 1);
    return {
      search: searchParams.get('search') ?? '',
      role: searchParams.get('role') ?? '',
      status: searchParams.get('status') ?? '',
      page: Number.isNaN(pageParam) ? 1 : pageParam,
    };
  }, [searchParams]);

  useEffect(() => {
    setSearch(urlState.search);
    setRoleFilter(urlState.role);
    setStatusFilter(urlState.status);
    setPage(urlState.page);
  }, [urlState]);

  const updateUrl = (next: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const updates = {
      search: next.search ?? search,
      role: next.role ?? roleFilter,
      status: next.status ?? statusFilter,
      page: next.page ?? page,
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === '1') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '');
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.users({
      page,
      limit: pageSize,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      search: search || undefined,
    }),
    queryFn: async () => {
      const response = await api.get<ApiResponse<User[]>>('/users', {
        params: {
          page,
          limit: pageSize,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
          search: search || undefined,
        },
      });
      return response.data;
    },
  });

  const users = data?.data ?? [];
  const pagedUsers = users;
  const totalPages = data?.meta?.totalPages ?? 1;
  const errorMessage =
    (error as AxiosError<{ message?: string }>)?.response?.data?.message ??
    'Failed to load users.';

  useEffect(() => {
    if (page > totalPages) {
      const nextPage = totalPages || 1;
      setPage(nextPage);
      updateUrl({ page: nextPage });
    }
  }, [page, totalPages]);


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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: User['status'] }) => {
      const response = await api.patch<ApiResponse<User>>(
        `/users/${id}/status`,
        { status },
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        role: createForm.role,
      };
      const response = await api.post<ApiResponse<User>>('/users', payload);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('User created');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setCreateOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'agent' });
    },
    onError: () => toast.error('Failed to create user'),
  });

  const availableRoles =
    user?.role === 'manager'
      ? ['agent', 'customer']
      : ['admin', 'manager', 'agent', 'customer'];

  const updateUserMutation = useMutation({
    mutationFn: async () => {
      if (!editUser) {
        throw new Error('No user selected');
      }
      const payload = {
        name: editForm.name.trim(),
        role: editForm.role,
      };
      const response = await api.patch<ApiResponse<User>>(
        `/users/${editUser._id}`,
        payload,
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
    },
    onError: () => toast.error('Failed to update user'),
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
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              setPage(1);
              updateUrl({ search: value, page: 1 });
            }}
            className="md:max-w-xs"
          />
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(event) => {
                const value = event.target.value;
                setRoleFilter(value);
                setPage(1);
                updateUrl({ role: value, page: 1 });
              }}
              className="rounded-xl border border-orange-100 px-3 py-2 text-sm"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="agent">Agent</option>
              <option value="customer">Customer</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => {
                const value = event.target.value;
                setStatusFilter(value);
                setPage(1);
                updateUrl({ status: value, page: 1 });
              }}
              className="rounded-xl border border-orange-100 px-3 py-2 text-sm"
            >
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
            {hasPermission('users:create') && (
              <Button onClick={() => setCreateOpen(true)}>Create User</Button>
            )}
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
        ) : isError ? (
          <div className="mt-6 rounded-2xl border border-dashed border-orange-200 p-6 text-center text-sm text-slate-500">
            {errorMessage}
          </div>
        ) : pagedUsers.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-orange-200 p-6 text-center text-sm text-slate-500">
            No users found.
          </div>
        ) : (
          <>
            <div className="mt-6 hidden space-y-2 md:block">
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
                className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4 rounded-2xl border border-orange-100 px-4 py-3 text-sm transition hover:border-orange-200"
              >
                <span className="font-semibold text-slate-900">{row.name}</span>
                <span className="text-slate-500">{row.email}</span>
                {roleBadge(row.role)}
                <div>
                  {hasPermission('users:edit') ? (
                    <select
                      value={row.status}
                      onChange={(event) =>
                        updateStatusMutation.mutate({
                          id: row._id,
                          status: event.target.value as User['status'],
                        })
                      }
                      className="rounded-xl border border-orange-100 px-2 py-1 text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                  ) : (
                    statusBadge(row.status)
                  )}
                </div>
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
                          Permissions
                        </button>
                      )}
                      {hasPermission('users:edit') && (
                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                          onClick={() => {
                            setEditUser(row);
                            setEditForm({
                              name: row.name,
                              role: row.role,
                            });
                          }}
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

            <div className="mt-6 space-y-3 md:hidden">
              {pagedUsers.map((row) => (
                <div
                  key={row._id}
                  className="rounded-2xl border border-orange-100 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.name}
                      </p>
                      <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600"
                        onClick={() => setSelectedUser(row)}
                      >
                        Permissions
                      </button>
                      {hasPermission('users:edit') && (
                        <button
                          type="button"
                          className="rounded-full border border-orange-200 px-3 py-1 text-[10px] font-semibold text-orange-600"
                          onClick={() => {
                            setEditUser(row);
                            setEditForm({
                              name: row.name,
                              role: row.role,
                            });
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {roleBadge(row.role)}
                    {hasPermission('users:edit') ? (
                      <select
                        value={row.status}
                        onChange={(event) =>
                          updateStatusMutation.mutate({
                            id: row._id,
                            status: event.target.value as User['status'],
                          })
                        }
                        className="rounded-full border border-orange-100 px-3 py-1 text-[10px] font-semibold text-slate-600"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                      </select>
                    ) : (
                      statusBadge(row.status)
                    )}
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                      {row.permissions?.length ?? 0} perms
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {hasPermission('users:suspend') && (
                      <button
                        type="button"
                        className="rounded-full border border-orange-200 px-3 py-1 text-[10px] font-semibold text-orange-600"
                        onClick={() => suspendMutation.mutate(row._id)}
                      >
                        Suspend
                      </button>
                    )}
                    {hasPermission('users:ban') && (
                      <button
                        type="button"
                        className="rounded-full border border-orange-200 px-3 py-1 text-[10px] font-semibold text-orange-600"
                        onClick={() => banMutation.mutate(row._id)}
                      >
                        Ban
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const nextPage = Math.max(1, page - 1);
                setPage(nextPage);
                updateUrl({ page: nextPage });
              }}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const nextPage = Math.min(totalPages, page + 1);
                setPage(nextPage);
                updateUrl({ page: nextPage });
              }}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {selectedUser ? (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 sm:items-stretch"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="flex h-full w-full flex-col bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-l-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Permissions
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedUser.name} - {selectedUser.email}
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
            <div className="flex-1 overflow-y-auto pr-1">
              <PermissionEditor
                user={selectedUser}
                currentUserPermissions={currentUserPermissions}
                canEdit={hasPermission('users:edit')}
                onSave={(updated) => setSelectedUser(updated)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {createOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Create User
                </h3>
                <p className="text-xs text-slate-500">
                  Add a new user with a role and password.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-slate-400 hover:text-orange-600"
                onClick={() => setCreateOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">
                  Name
                </label>
                <Input
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">
                  Email
                </label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="user@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">
                  Password
                </label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">
                  Role
                </label>
                <select
                  value={createForm.role}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <Button
                  className="w-full"
                  onClick={() => createMutation.mutate()}
                  isLoading={createMutation.isPending}
                  disabled={
                    !createForm.name.trim() ||
                    !createForm.email.trim() ||
                    createForm.password.length < 6
                  }
                >
                  Create User
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editUser ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setEditUser(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Edit User
                </h3>
                <p className="text-xs text-slate-500">
                  Update profile details and role.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-slate-400 hover:text-orange-600"
                onClick={() => setEditUser(null)}
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">
                  Name
                </label>
                <Input
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">
                  Email (read-only)
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  {editUser?.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-orange-100 px-3 py-2 text-sm"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <Button
                  className="w-full"
                  onClick={() => updateUserMutation.mutate()}
                  isLoading={updateUserMutation.isPending}
                  disabled={!editForm.name.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
}
