"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AUTH_CONFIG } from '@/config/auth'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()
  const {resolvedTheme} = useTheme()
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setError('')
    const success = await login(email, password)

    if (typeof success === 'string') {
      setError(success as string)
    } else {
      router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
    }
    
    setIsLoading(false)
  }
  
  return (
    <div className="grid min-h-svh lg:grid-cols-1">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-4 text-center pb-4">
                <Image 
                  src={theme === "dark" ? "/images/logo2.png" : "/images/logo1.png"} 
                  alt="Logo" 
                  width={200} 
                  height={100}
                  priority
                />
              </div>
              {error && <p className="text-red-500 font-medium text-center mb-2">{error}</p>}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Input
                    title="Email"
                    id="email"
                    type="email"
                    required
                    name="login"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="grid gap-3">
                  <Input
                    id="password"
                    type="password"
                    required
                    title="Senha"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                  />
                  {/* <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div> */}
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 