import PageWrapper from '../../../components/layout/PageWrapper';

export default function DashboardPage() {
  return (
    <PageWrapper title="Dashboard">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Welcome to Obliq. Your analytics and performance overview will appear
          here.
        </p>
      </div>
    </PageWrapper>
  );
}
