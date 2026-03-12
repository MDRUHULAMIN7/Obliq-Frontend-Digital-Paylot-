'use client';

import { Bell, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';

type HeaderProps = {
  title: string;
  onToggleSidebar?: () => void;
};

export default function Header({ title, onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-orange-100 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 text-slate-700 hover:border-orange-200 hover:text-orange-600 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLogout}
          className="hidden items-center gap-2 rounded-full border border-orange-100 px-3 py-2 text-xs font-semibold text-orange-600 hover:border-orange-200 hover:bg-orange-50 sm:flex"
        >
          <LogOut size={14} />
          Logout
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 text-orange-600 hover:border-orange-200 hover:bg-orange-50 sm:hidden"
        >
          <LogOut size={16} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 text-slate-700 hover:border-orange-200 hover:text-orange-600">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 text-center text-sm font-semibold text-orange-600">
            <span className="flex h-full w-full items-center justify-center">
              {user?.name?.slice(0, 2)?.toUpperCase() ?? 'OB'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name ?? 'Obliq User'}
            </p>
            <p className="text-xs text-slate-500">{user?.role ?? 'guest'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
