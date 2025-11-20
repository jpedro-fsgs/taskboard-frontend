import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login - Taskboard',
  description: 'Faça login na sua conta Taskboard',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Taskboard</h1>
          <p className="mt-2 text-muted-foreground">
            Organize suas tarefas de forma hierárquica
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
