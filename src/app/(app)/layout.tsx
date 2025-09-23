"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true}>
      <SidebarProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </SidebarProvider>
    </AuthGuard>
  );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const handleMenuItemClick = (url: string) => {
    router.push(url, {
      scroll: false,
    });
  };

  console.log(user.user_name);
  
  return (
    <div className="flex h-screen w-screen w-full">
      <AppSidebar 
        user={{
          name: user?.user_name || '',
          email: user?.email || '',
          avatar: '',
        }}
        currentPath={pathname}
        onMenuItemClick={handleMenuItemClick}
      />
      <div className={`flex-1 min-w-[0px] ${isMobile ? 'pt-14' : ''}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    </div>
  );
}
