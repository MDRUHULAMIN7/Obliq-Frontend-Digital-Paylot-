'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/opportunities': 'Opportunities',
  '/tasks': 'Tasks',
  '/tasks/assignments': 'Assignments',
  '/tasks/calendar': 'Calendar',
  '/tasks/reminders': 'Reminders',
  '/reports': 'Reports',
  '/users': 'Users',
  '/contacts': 'Contacts',
  '/messages': 'Messages',
  '/audit': 'Audit Logs',
  '/settings': 'Settings',
  '/help-center': 'Help Center',
  '/invoice': 'Invoice',
  '/customer-portal': 'Customer Portal',
  '/403': 'Access Denied',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = titleMap[Object.keys(titleMap).find((path) => pathname.startsWith(path)) ?? ''] ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen lg:pl-72">
        <Header title={title} onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
