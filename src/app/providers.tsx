"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"
import { ContrastProvider } from "@/contexts/contrast-context"
import { ModalProvider } from "@/hooks/use-modal/use-modal"
import { Toaster } from "@/components/ui/sonner"
import { AUTH_CONFIG } from "@/config/auth"

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ContrastProvider defaultContrast="normal">
          <AuthProvider enabled={AUTH_CONFIG.AUTH_ENABLED}>
            <ModalProvider>
              {children}
              <Toaster richColors />
            </ModalProvider>
          </AuthProvider>
        </ContrastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
