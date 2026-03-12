import PageWrapper from '../../../components/layout/PageWrapper';

export default function OpportunitiesPage() {
  return (
    <PageWrapper title="Opportunities">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Track and manage opportunity pipelines here.
        </p>
      </div>
    </PageWrapper>
  );
}
