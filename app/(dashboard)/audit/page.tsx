'use client';

import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import PageWrapper from '../../../components/layout/PageWrapper';
import { api } from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { ApiResponse, AuditLog } from '../../../types';
import { formatDateTime } from '../../../lib/utils';
import Button from '../../../components/ui/Button';

type AuditResponse = {
  meta: { page: number; limit: number; total: number; totalPages: number };
  data: AuditLog[];
};

export default function AuditPage() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    action: '',
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const queryKey = useMemo(() => queryKeys.auditLogs(filters), [filters]);

  const fetchLogs = async ({ pageParam = 1 }) => {
    const response = await api.get<ApiResponse<AuditResponse>>('/audit', {
      params: {
        page: pageParam,
        limit: 10,
        from: filters.from || undefined,
        to: filters.to || undefined,
        action: filters.action || undefined,
      },
    });
    return response.data.data;
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: fetchLogs,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.page < lastPage.meta.totalPages) {
          return lastPage.meta.page + 1;
        }
        return undefined;
      },
    });

  const logs = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <PageWrapper title="Audit Logs">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              From
            </label>
            <input
              type="date"
              value={filters.from}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, from: event.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              To
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, to: event.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, action: event.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-orange-100 px-3 py-2 text-sm"
            >
              <option value="">All actions</option>
              <option value="users:create">users:create</option>
              <option value="users:update">users:update</option>
              <option value="users:suspend">users:suspend</option>
              <option value="users:ban">users:ban</option>
              <option value="users:delete">users:delete</option>
              <option value="permissions:update">permissions:update</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ from: '', to: '', action: '' })}
            >
              Reset
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-xl bg-orange-50"
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 p-6 text-center text-sm text-slate-500">
            No audit logs found.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-[1.3fr_1fr_1fr_2fr_1fr] gap-4 border-b border-orange-100 pb-3 text-xs font-semibold uppercase text-slate-400">
              <span>Action</span>
              <span>Performed By</span>
              <span>Target User</span>
              <span>Details</span>
              <span>Date & Time</span>
            </div>
            {logs.map((log) => (
              <div key={log._id} className="rounded-2xl border border-orange-100">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => (prev === log._id ? null : log._id))
                  }
                  className="grid w-full grid-cols-[1.3fr_1fr_1fr_2fr_1fr] items-center gap-4 px-4 py-3 text-left text-sm"
                >
                  <span className="font-semibold text-slate-800">
                    {log.action}
                  </span>
                  <span className="text-slate-500">
                    {log.performedBy?.name ?? 'Unknown'}
                  </span>
                  <span className="text-slate-500">
                    {log.targetUser?.name ?? '—'}
                  </span>
                  <span className="truncate text-slate-500">
                    {log.details ?? '—'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDateTime(log.createdAt)}
                  </span>
                </button>
                {expanded === log._id ? (
                  <div className="border-t border-orange-100 bg-orange-50/40 px-4 py-3 text-xs text-slate-600">
                    {typeof log.details === 'string'
                      ? log.details
                      : JSON.stringify(log.details, null, 2)}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading...'
              : hasNextPage
                ? 'Load more'
                : 'No more logs'}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
