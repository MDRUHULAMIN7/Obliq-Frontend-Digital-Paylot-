import PageWrapper from '../../../components/layout/PageWrapper';

export default function CustomerPortalPage() {
  return (
    <PageWrapper title="Customer Portal">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          This is the customer self-service area. Orders, tickets, and account
          activity will appear here.
        </p>
      </div>
    </PageWrapper>
  );
}
