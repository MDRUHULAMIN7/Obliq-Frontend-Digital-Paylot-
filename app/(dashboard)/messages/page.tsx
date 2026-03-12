import PageWrapper from '../../../components/layout/PageWrapper';

export default function MessagesPage() {
  return (
    <PageWrapper title="Messages">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Recent Threads
            </h3>
            <span className="text-xs text-slate-500">8 unread</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Rashed H.', text: 'Need update on delivery', time: '2m' },
              { name: 'Support Team', text: 'Ticket #1184 assigned', time: '8m' },
              { name: 'Client Ops', text: 'Approve new quote', time: '1h' },
            ].map((thread) => (
              <div
                key={thread.name}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {thread.name}
                  </p>
                  <p className="text-xs text-slate-500">{thread.text}</p>
                </div>
                <span className="text-[10px] text-slate-400">
                  {thread.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-base font-semibold text-slate-900">
            Message Stats
          </h3>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Open conversations', value: '14' },
              { label: 'SLA risk', value: '2' },
              { label: 'Avg response time', value: '18m' },
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
