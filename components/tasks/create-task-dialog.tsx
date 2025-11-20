"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { apiUrl } from "@/lib/utils";
import { Task } from "./task-list";

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tasks: Task[];
    defaultParentId?: string;
    /**
     * When true, the parent is locked to `defaultParentId` (can be empty string for root)
     * and the parent select is hidden/disabled. Use this for the global "Nova Tarefa" button
     * (pass empty defaultParentId and parentLocked=true) or for the per-task add button
     * (pass the task id and parentLocked=true).
     */
    parentLocked?: boolean;
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

    // Keep the parent in sync when dialog opens or defaultParentId changes
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            parent_task_id: defaultParentId || "",
        }));
    }, [isOpen, defaultParentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(apiUrl("/api/tasks/create"), {
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
                toast("Tarefa criada com sucesso!", {});
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
            toast("Erro ao criar tarefa", {
                // variant: "destructive",
            });
            console.error(error);
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
                    {formData.parent_task_id && (
                        <div className="rounded-md border bg-muted p-2 text-sm">
                            Subtarefa de:{" "}
                            {tasks.find((t) => t.id === formData.parent_task_id)
                                ?.title || formData.parent_task_id}
                        </div>
                    )}
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
