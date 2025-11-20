"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiUrl } from '@/lib/utils'
import { Task } from "./task-list";

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tasks: Task[];
    defaultParentId?: string;
}

export function CreateTaskDialog({
    isOpen,
    onClose,
    onSuccess,
    tasks,
    defaultParentId,
}: CreateTaskDialogProps) {
    // const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        parent_task_id: defaultParentId || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(apiUrl('/api/tasks/create'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description || undefined,
                    parent_task_id: formData.parent_task_id || undefined,
                    is_done: false,
                }),
            });

            if (response.ok) {
                toast("Tarefa criada com sucesso!",{
                });
                setFormData({
                    title: "",
                    description: "",
                    parent_task_id: defaultParentId || "",
                });
                onSuccess();
                onClose();
            } else {
                toast("Erro ao criar tarefa", {
                    // variant: "destructive",
                });
            }
        } catch (error) {
            toast("Erro ao criar tarefa",{
                // variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                    <DialogDescription>
                        Crie uma nova tarefa ou subtarefa
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Implementar feature X"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            placeholder="Detalhes sobre a tarefa..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent">Tarefa Pai (opcional)</Label>
                        <Select
                            value={formData.parent_task_id}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    parent_task_id: value,
                                })
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Nenhuma (tarefa principal)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">
                                    Nenhuma (tarefa principal)
                                </SelectItem>
                                {tasks
                                    .filter((t) => !t.is_done)
                                    .map((task) => (
                                        <SelectItem
                                            key={task.id}
                                            value={task.id}
                                        >
                                            {task.title}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? "Criando..." : "Criar Tarefa"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
