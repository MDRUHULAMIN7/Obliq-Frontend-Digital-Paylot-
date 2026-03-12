import PageWrapper from '../../../../components/layout/PageWrapper';

export default function RemindersPage() {
  return (
    <PageWrapper title="Reminders">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Reminders and follow-up scheduling will appear here.
        </p>
      </div>
    </PageWrapper>
  );
}
