'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { PermissionAtom, User } from '../../types';
import { PERMISSION_GROUPS } from '../../lib/permissions';
import { api } from '../../lib/api';
import Button from '../ui/Button';
import { queryKeys } from '../../lib/queryKeys';

type PermissionEditorProps = {
  user: User;
  currentUserPermissions: PermissionAtom[];
  canEdit?: boolean;
  onSave?: (updated: User) => void;
};

export default function PermissionEditor({
  user,
  currentUserPermissions,
  canEdit = true,
  onSave,
}: PermissionEditorProps) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<PermissionAtom[]>(
    user.permissions ?? [],
  );

  useEffect(() => {
    setSelected(user.permissions ?? []);
  }, [user]);

  const allowedPermissions = useMemo(
    () => new Set(currentUserPermissions),
    [currentUserPermissions],
  );

  const mutation = useMutation({
    mutationFn: async (permissions: PermissionAtom[]) => {
      const response = await api.patch(`/users/${user._id}/permissions`, {
        permissions,
      });
      return response.data?.data as User;
    },
    onSuccess: (updatedUser) => {
      toast.success('Permissions updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPermissions(user._id),
      });
      onSave?.(updatedUser);
    },
    onError: () => {
      toast.error('Failed to update permissions');
    },
  });

  const togglePermission = (permission: PermissionAtom) => {
    setSelected((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission],
    );
  };

  return (
    <div className="space-y-6">
      {!canEdit ? (
        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs text-orange-700">
          You cannot edit this user&apos;s permissions.
        </div>
      ) : null}
      {Object.entries(PERMISSION_GROUPS).map(([group, items]) => (
        <div key={group}>
          <h4 className="text-xs font-semibold uppercase text-slate-400">
            {group}
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {items.map((permission) => {
              const enabled = allowedPermissions.has(permission) && canEdit;
              const checked = selected.includes(permission);
              return (
                <label
                  key={permission}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-sm ${
                    enabled
                      ? 'border-orange-100 bg-white'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                  title={
                    enabled ? undefined : "You don't have this permission"
                  }
                >
                  <span>{permission}</span>
                  <button
                    type="button"
                    disabled={!enabled}
                    onClick={() => togglePermission(permission)}
                    className={`h-6 w-11 rounded-full transition ${
                      checked ? 'bg-orange-500' : 'bg-slate-200'
                    } ${!enabled ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <span
                      className={`block h-5 w-5 translate-x-0 rounded-full bg-white shadow transition ${
                        checked ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 bg-white pt-4">
        <Button
          className="w-full"
          onClick={() => mutation.mutate(selected)}
          isLoading={mutation.isPending}
          disabled={!canEdit}
        >
          {canEdit ? 'Save Changes' : 'Read Only'}
        </Button>
      </div>
    </div>
  );
}
