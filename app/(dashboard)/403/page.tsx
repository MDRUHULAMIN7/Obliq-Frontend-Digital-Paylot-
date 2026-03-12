import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-[var(--shadow-soft)]">
      <p className="text-7xl font-bold text-orange-500">403</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        Access Denied
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        You don&apos;t have permission to view this page. Contact your
        administrator.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
