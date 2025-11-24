'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskItem } from './task-item'
import { CreateTaskDialog } from './create-task-dialog'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { apiUrl } from '@/lib/utils'

export interface Task {
  id: string
  title: string
  description: string | null
  is_done: boolean
  deleted_at: string | null
  user_id: string
  parent_task_id: string | null
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await fetch(apiUrl('/api/tasks/'), {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data.items.filter((task: Task) => !task.deleted_at))
      } else {
          toast.error('Erro ao carregar tarefas')
      }
    } catch (error) {
      toast.error('Erro ao carregar tarefas')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Organizar tarefas em estrutura de árvore
  const buildTaskTree = (tasks: Task[]): Task[] => {
    const taskMap = new Map<string, Task & { children?: Task[] }>()
    const rootTasks: Task[] = []

    // Criar mapa de todas as tarefas
    tasks.forEach((task) => {
      taskMap.set(task.id, { ...task, children: [] })
    })

    // Construir hierarquia
    tasks.forEach((task) => {
      const taskWithChildren = taskMap.get(task.id)!
      if (task.parent_task_id) {
        const parent = taskMap.get(task.parent_task_id)
        if (parent) {
          parent.children!.push(taskWithChildren)
        } else {
          rootTasks.push(taskWithChildren)
        }
      } else {
        rootTasks.push(taskWithChildren)
      }
    })

    // Ordenar: tarefas não concluídas primeiro
    const sortTasks = (taskList: Task[]) => {
      return taskList.sort((a, b) => {
        if (a.is_done === b.is_done) return 0
        return a.is_done ? 1 : -1
      })
    }

    const sortRecursively = (task: Task & { children?: Task[] }) => {
      if (task.children && task.children.length > 0) {
        task.children = sortTasks(task.children)
        task.children.forEach(sortRecursively)
      }
    }

    const sortedRootTasks = sortTasks(rootTasks)
    sortedRootTasks.forEach(sortRecursively)

    return sortedRootTasks
  }

  const taskTree = buildTaskTree(tasks)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Minhas Tarefas</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.filter((t) => !t.is_done).length} tarefa(s) pendente(s)
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {taskTree.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">Nenhuma tarefa ainda</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie sua primeira tarefa para começar
          </p>
          <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Tarefa
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          {taskTree.map((task) => (
            <TaskItem key={task.id} task={task} tasks={tasks} onUpdate={fetchTasks} level={0} />
          ))}
        </div>
      )}

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchTasks}
        tasks={tasks}
        defaultParentId={""}
        parentLocked={true}
      />
    </div>
  )
}
