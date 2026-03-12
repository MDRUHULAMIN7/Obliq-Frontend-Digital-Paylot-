import PageWrapper from '../../../components/layout/PageWrapper';

export default function InvoicePage() {
  return (
    <PageWrapper title="Invoice">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Invoice summaries and billing history will appear here.
        </p>
      </div>
    </PageWrapper>
  );
}
