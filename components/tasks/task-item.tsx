"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react";
import { Task } from "./task-list";
import { toast } from "sonner";
import { cn, apiUrl } from "@/lib/utils";
import { CreateTaskDialog } from "./create-task-dialog";

interface TaskItemProps {
    task: Task & { children?: Task[] };
    tasks: Task[];
    onUpdate: () => void;
    level: number;
}

export function TaskItem({ task, tasks, onUpdate, level }: TaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    // const { toast } = useToast()
    const hasChildren = task.children && task.children.length > 0;

    const handleToggleDone = async () => {
        try {
            const response = await fetch(apiUrl('/api/tasks/set-done'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    task_id: task.id,
                    is_done: !task.is_done,
                }),
            });

            if (response.ok) {
                onUpdate();
            } else {
                toast("Erro ao atualizar tarefa", {
                    // variant: 'destructive',
                });
            }
        } catch (error) {
            toast("Erro ao atualizar tarefa", {
                // variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

        try {
            const response = await fetch(apiUrl(`/api/tasks/${task.id}`), {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                toast("Tarefa excluída", {});
                onUpdate();
            } else {
                toast("Erro ao excluir tarefa", {
                    // variant: 'destructive',
                });
            }
        } catch (error) {
            toast("Erro ao excluir tarefa", {
                // variant: 'destructive',
            });
        }
    };

    return (
        <div>
            <div
                className={cn(
                    "group flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50",
                    task.is_done && "opacity-60"
                )}
                style={{ marginLeft: `${level * 24}px` }}
            >
                {hasChildren && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                )}

                <Checkbox
                    checked={task.is_done}
                    onCheckedChange={handleToggleDone}
                    className="mt-0.5"
                />

                <div className="flex-1 space-y-1">
                    <h3
                        className={cn(
                            "font-medium leading-none",
                            task.is_done && "text-muted-foreground line-through"
                        )}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-sm text-muted-foreground">
                            {task.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsCreateDialogOpen(true)}
                        title="Adicionar subtarefa"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={handleDelete}
                        title="Excluir tarefa"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="mt-1 space-y-1">
                    {task.children!.map((child) => (
                        <TaskItem
                            key={child.id}
                            task={child}
                            tasks={tasks}
                            onUpdate={onUpdate}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}

            <CreateTaskDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSuccess={onUpdate}
                tasks={tasks}
                defaultParentId={task.id}
            />
        </div>
    );
}
