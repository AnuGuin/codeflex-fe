'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Logo from './logo'
import { registerUser } from '@/lib/api'

export default function SignupPage() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await registerUser({
      username: `${firstname} ${lastname}` || username,
      email: username, // field label says username but backend expects 'email'
      password,
    })

    if (res?.statusCode === 201) {
      setMessage('✅ Account created successfully! You can now sign in.')
    } else {
      setMessage(`❌ ${res?.message || 'Something went wrong.'}`)
    }
    setLoading(false)
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Sign up</h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="block text-sm">
                  Firstname
                </Label>
                <Input
                  type="text"
                  required
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="block text-sm">
                  Lastname
                </Label>
                <Input
                  type="text"
                  required
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Username
              </Label>
              <Input
                type="email"
                required
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pwd" className="text-sm">
                Password
              </Label>
              <Input
                type="password"
                required
                id="pwd"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Continue'}
            </Button>

            {message && (
              <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/auth?mode=login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}