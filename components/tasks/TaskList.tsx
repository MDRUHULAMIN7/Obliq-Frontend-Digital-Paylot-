export default function TaskList() {
  const tasks = [
    {
      id: 1,
      title: 'Call about proposal',
      client: 'Bluestone',
      priority: 'Urgent',
      due: '18th Jul',
      badge: 'bg-rose-100 text-rose-600',
    },
    {
      id: 2,
      title: 'Send onboarding docs',
      client: 'Tech Ltd.',
      priority: 'High',
      due: '17th Jul',
      badge: 'bg-orange-100 text-orange-600',
    },
    {
      id: 3,
      title: 'Follow up with Mira',
      client: 'Omar Rahman',
      priority: 'Low',
      due: '17th Jul',
      badge: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 4,
      title: 'Prepare pitch deck',
      client: 'Jabed Ali',
      priority: 'Medium',
      due: '14th Jul',
      badge: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          Search table
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-white px-3 py-1 text-slate-900 shadow-sm">
            List
          </span>
          <span className="px-3 py-1">Kanban</span>
          <span className="px-3 py-1">Calendar</span>
        </div>
      </div>

      <div className="mt-5 space-y-6">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Group 1
          </p>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[20px_1fr] items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-xs text-slate-500"
              >
                <div className="mt-1 h-4 w-4 rounded border border-slate-300" />
                <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_auto_auto] sm:items-center">
                  <p className="text-sm font-medium text-slate-900">
                    {task.title}
                  </p>
                  <span className="text-xs text-slate-500">{task.client}</span>
                  <span
                    className={`w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${task.badge}`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-xs text-slate-400">{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Group 2
          </p>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
            Drag tasks here to create another group
          </div>
        </div>
      </div>
    </div>
  );
}
