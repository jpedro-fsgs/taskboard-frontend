import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export const metadata = {
  title: 'Cadastro - Taskboard',
  description: 'Crie sua conta Taskboard',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Taskboard</h1>
          <p className="mt-2 text-muted-foreground">
            Crie sua conta para começar
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
