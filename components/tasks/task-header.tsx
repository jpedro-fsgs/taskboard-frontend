"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiUrl } from '@/lib/utils'

export function TaskHeader() {
    const router = useRouter();
    // const { toast } = useToast()

    const handleLogout = async () => {
        try {
            const response = await fetch(apiUrl('/api/auth/logout'), {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                toast("Logout realizado", {
                    description: "Até logo!",
                });
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            toast("Erro ao fazer logout", {
                // variant: 'destructive',
            });
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="border-b bg-card">
            <div className="mx-auto flex max-w-5xl items-center justify-between p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Taskboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie suas tarefas
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>
        </header>
    );
}
