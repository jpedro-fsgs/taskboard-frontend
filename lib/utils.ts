import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base URL para chamadas de API no cliente. Use a variável de ambiente NEXT_PUBLIC_API_URL
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

/**
 * Normaliza e monta a URL completa para chamadas à API a partir de um path relativo.
 * Ex: apiUrl('/api/tasks') -> `${API_BASE}/api/tasks` (sem duplicar barras)
 */
export function apiUrl(path: string) {
  const base = API_BASE.replace(/\/$/, '')
  if (!path.startsWith('/')) path = '/' + path
  return `${base}${path}`
}
