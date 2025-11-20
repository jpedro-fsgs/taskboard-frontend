import { TaskList } from '@/components/tasks/task-list'
import { TaskHeader } from '@/components/tasks/task-header'

export const metadata = {
  title: 'Minhas Tarefas - Taskboard',
  description: 'Gerencie suas tarefas',
}

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background">
      <TaskHeader />
      <main className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <TaskList />
      </main>
    </div>
  )
}
