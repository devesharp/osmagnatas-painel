"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_CONFIG } from "@/config/auth";
import Image from "next/image";
import { useTheme } from "next-themes";
import { LoadingSpinner } from "../ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = precisa estar logado, false = precisa estar deslogado
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // Usuário precisa estar logado mas não está
      router.push(redirectTo || AUTH_CONFIG.ROUTES.LOGIN);
    } else if (!requireAuth && isAuthenticated) {
      // Usuário precisa estar deslogado mas está logado
      router.push(redirectTo || AUTH_CONFIG.ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={
              theme === "dark"
                ? "/images/logo2.png"
                : "/images/logo1.png"
            }
            alt="Logo"
            width={200}
            height={100}
            priority
          />

          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Se chegou aqui, a condição de auth está correta
  if (requireAuth && isAuthenticated) {
    return <>{children}</>;
  }

  if (!requireAuth && !isAuthenticated) {
    return <>{children}</>;
  }

  // Caso contrário, não renderiza nada (redirecionamento já foi feito)
  return null;
}
