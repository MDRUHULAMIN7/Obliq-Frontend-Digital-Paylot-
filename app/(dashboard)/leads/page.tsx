import PageWrapper from '../../../components/layout/PageWrapper';

export default function LeadsPage() {
  return (
    <PageWrapper title="Leads">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Manage and track your leads here.
        </p>
      </div>
    </PageWrapper>
  );
}
