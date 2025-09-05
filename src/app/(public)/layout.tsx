import { AuthGuard } from '@/components/auth/auth-guard'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  )
} 