import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = await cookies()
  const hasAuth = cookieStore.has('access_token')

  if (hasAuth) {
    redirect('/tasks')
  } else {
    redirect('/login')
  }
}
