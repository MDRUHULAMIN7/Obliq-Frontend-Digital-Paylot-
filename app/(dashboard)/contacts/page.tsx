import PageWrapper from '../../../components/layout/PageWrapper';

export default function ContactsPage() {
  return (
    <PageWrapper title="Contacts">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Directory
            </h3>
            <span className="text-xs text-slate-500">23 contacts</span>
          </div>
          <div className="mt-4 space-y-3">
            {['Farhana Ahmed', 'Md Rahim', 'Jannat Sultana', 'Ayaan Rahman'].map(
              (name, index) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {name.split(' ')[0].toLowerCase()}@client.com
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600">
                    Active
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-base font-semibold text-slate-900">
            Quick Insights
          </h3>
          <div className="mt-4 space-y-3">
            {[
              { label: 'New this week', value: '6' },
              { label: 'Needs follow up', value: '4' },
              { label: 'High priority', value: '3' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
