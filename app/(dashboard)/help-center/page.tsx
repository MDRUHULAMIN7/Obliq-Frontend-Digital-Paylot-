import PageWrapper from '../../../components/layout/PageWrapper';

export default function HelpCenterPage() {
  return (
    <PageWrapper title="Help Center">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Help articles, FAQs, and support links will appear here.
        </p>
      </div>
    </PageWrapper>
  );
}
