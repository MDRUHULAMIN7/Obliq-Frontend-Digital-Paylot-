import PageWrapper from '../../../components/layout/PageWrapper';

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings">
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-slate-500">
          Manage workspace configuration and preferences.
        </p>
      </div>
    </PageWrapper>
  );
}
