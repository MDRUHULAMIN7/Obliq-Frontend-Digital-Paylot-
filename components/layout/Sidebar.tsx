'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Gauge,
  LayoutGrid,
  MessageCircle,
  Settings,
  StickyNote,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import useAuth from '../../hooks/useAuth';
import usePermission from '../../hooks/usePermission';
import type { PermissionAtom } from '../../types';
import { cn } from '../../lib/utils';

type NavItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  permission?: PermissionAtom;
  children?: NavItem[];
};

const buildNav = (): {
  main: NavItem[];
  users: NavItem[];
  other: NavItem[];
  bottom: NavItem[];
} => ({
  main: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Gauge size={18} />,
      permission: 'dashboard:view',
    },
    {
      label: 'Leads',
      href: '/leads',
      icon: <LayoutGrid size={18} />,
      permission: 'leads:view',
    },
    {
      label: 'Opportunities',
      href: '/opportunities',
      icon: <StickyNote size={18} />,
      permission: 'leads:view',
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: <CalendarDays size={18} />,
      permission: 'tasks:view',
      children: [
        { label: 'Assignments', href: '/tasks/assignments', permission: 'tasks:view' },
        { label: 'Calendar', href: '/tasks/calendar', permission: 'tasks:view' },
        { label: 'Reminders', href: '/tasks/reminders', permission: 'tasks:view' },
      ],
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: <LayoutGrid size={18} />,
      permission: 'reports:view',
    },
  ],
  users: [
    {
      label: 'Users',
      href: '/users',
      icon: <Users size={18} />,
      permission: 'users:view',
    },
    {
      label: 'Customer Portal',
      href: '/customer-portal',
      icon: <LayoutGrid size={18} />,
      permission: 'customer_portal:view',
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: <MessageCircle size={18} />,
      permission: 'users:view',
    },
  ],
  other: [
    {
      label: 'Configuration',
      href: '/settings',
      icon: <Settings size={18} />,
      permission: 'settings:view',
    },
    {
      label: 'Invoice',
      href: '/invoice',
      icon: <CreditCard size={18} />,
      permission: 'reports:view',
    },
  ],
  bottom: [
    {
      label: 'Help center',
      href: '/help-center',
      icon: <CircleHelp size={18} />,
      permission: 'settings:view',
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings size={18} />,
      permission: 'settings:view',
    },
  ],
});

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  const [tasksOpen, setTasksOpen] = useState(true);
  const nav = useMemo(() => buildNav(), []);

  const filterItems = (items: NavItem[]) => {
    if (!user) {
      return items;
    }
    return items.filter(
      (item) => !item.permission || hasPermission(item.permission),
    );
  };

  const activeHref = useMemo(() => {
    const groups = [nav.main, nav.users, nav.other, nav.bottom];
    for (const group of groups) {
      for (const item of group) {
        if (item.href && pathname.startsWith(item.href)) {
          return item.href;
        }
        if (item.children?.length) {
          const match = item.children.find(
            (child) => child.href && pathname.startsWith(child.href),
          );
          if (match) {
            return item.href;
          }
        }
      }
    }
    return null;
  }, [nav, pathname]);

  const renderItem = (item: NavItem) => {
    const hasChildren = item.children?.length;
    const active = item.href ? item.href === activeHref : false;
    const showChildren = item.label === 'Tasks' ? tasksOpen : true;
    const activeChildHref = item.children?.find(
      (child) => child.href && pathname.startsWith(child.href),
    )?.href;

    return (
      <div key={item.label}>
        <div className="flex items-center justify-between">
          <Link
            href={item.href ?? '#'}
            className={cn(
              'flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              active
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700',
            )}
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </Link>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setTasksOpen((prev) => !prev)}
              className="ml-2 flex h-8 w-8 items-center justify-center text-slate-400 hover:text-orange-600"
            >
              <ChevronDown
                size={16}
                className={cn('transition', tasksOpen ? 'rotate-180' : '')}
              />
            </button>
          ) : null}
        </div>
        {hasChildren && showChildren ? (
          <div className="ml-8 mt-2 space-y-1 border-l border-orange-100 pl-3">
            {filterItems(item.children ?? []).map((child) => (
              <Link
                key={child.label}
                href={child.href ?? '#'}
                className={cn(
                  'block rounded-lg px-2 py-1 text-xs font-medium',
                  child.href && child.href === activeChildHref
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-slate-500 hover:text-orange-600',
                )}
                onClick={onClose}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 transition lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-orange-100 bg-white px-4 pb-6 pt-8 transition lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            {user?.name?.slice(0, 2)?.toUpperCase() ?? 'OB'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {user?.name ?? 'Obliq Workspace'}
            </p>
            <p className="text-xs text-slate-500">{user?.email ?? 'welcome'}</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Main
            </p>
            <div className="space-y-2">
              {filterItems(nav.main).map(renderItem)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Users
            </p>
            <div className="space-y-2">
              {filterItems(nav.users).map(renderItem)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Other
            </p>
            <div className="space-y-2">
              {filterItems(nav.other).map(renderItem)}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 px-2">
          {filterItems(nav.bottom).map(renderItem)}
        </div>
      </aside>
    </>
  );
}
