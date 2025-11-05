'use client'

import { useSearchParams } from 'next/navigation'
import LoginPage from '@/components/ui/login'
import SignupPage from '@/components/ui/signup'

export function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'login'

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-black dark:to-blue-900">
      {/* Diagonal Fade Center Grid Background - Lowest layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 0.5px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 0.5px)
          `,
          backgroundSize: '32px 32px',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, #000 20%, transparent 80%)',
          maskImage:
            'radial-gradient(circle at 50% 50%, #000 20%, transparent 80%)',
          opacity: 0.25,
        }}
      />
      
      {/* Blue Gradient Overlay - Middle layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle 1200px at 50% 40%, rgba(59,130,246,0.5), transparent),
            radial-gradient(circle 800px at 80% 70%, rgba(96,165,250,0.4), transparent),
            radial-gradient(circle 600px at 20% 80%, rgba(147,197,253,0.3), transparent)
          `,
        }}
      />
      
      {/* Auth Component - Highest layer */}
      <div className="relative z-10">
        {mode === 'login' ? <LoginPage /> : <SignupPage />}
      </div>
    </div>
  )
}
