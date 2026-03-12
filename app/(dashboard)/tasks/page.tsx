import PageWrapper from '../../../components/layout/PageWrapper';
import TaskList from '../../../components/tasks/TaskList';
import TaskKanban from '../../../components/tasks/TaskKanban';

export default function TasksPage() {
  return (
    <PageWrapper title="Tasks">
      <div className="grid gap-6 lg:grid-cols-2">
        <TaskList />
        <TaskKanban />
      </div>
    </PageWrapper>
  );
}
