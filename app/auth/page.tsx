import { AuthPage } from '@/components/authpage/auth-page'
import { Suspense } from 'react'
import BounceLoader from '@/components/ui/bouncerloader'

export default function Auth() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-black dark:to-blue-900">
        <BounceLoader />
      </div>
    }>
      <AuthPage />
    </Suspense>
  )
}
