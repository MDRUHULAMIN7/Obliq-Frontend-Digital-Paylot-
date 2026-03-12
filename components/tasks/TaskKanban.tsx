export default function TaskKanban() {
  const columns = [
    {
      title: 'Backlog',
      items: [
        { title: 'Call about proposal ', tag: 'Urgent', tagClass: 'bg-rose-100 text-rose-600' },
        { title: 'Send onboarding doc', tag: 'High', tagClass: 'bg-orange-100 text-orange-600' },
      ],
    },
    {
      title: 'In progress',
      items: [
        { title: 'Follow up with Mira', tag: 'Low', tagClass: 'bg-emerald-100 text-emerald-600' },
        { title: 'Prepare pitch deck', tag: 'Medium', tagClass: 'bg-amber-100 text-amber-600' },
      ],
    },
    {
      title: 'Done',
      items: [
        { title: 'Project completion', tag: 'Completed', tagClass: 'bg-slate-100 text-slate-600' },
      ],
    },
  ];

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Kanban</p>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-semibold text-orange-600">
          3 columns
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.title} className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {column.title}
              </p>
              <span className="text-[10px] text-slate-400">
                {column.items.length}
              </span>
            </div>
            <div className="space-y-3">
              {column.items.map((item, index) => (
                <div
                  key={`${column.title}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                      Due 15 Nov
                    </span>
                    <span className={`rounded-full px-2 py-1 ${item.tagClass}`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
