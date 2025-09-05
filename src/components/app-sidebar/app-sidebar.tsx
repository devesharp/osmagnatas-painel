import React, { useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { AppSidebarProps } from "./app-sidebar.types";
import { useAppSidebarCtrl } from "./app-sidebar.ctrl";
import { AppSidebarUser } from "./parts/app-sidebar--user";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar(props: AppSidebarProps) {
  const ctrl = useAppSidebarCtrl(props);
  const { onUserClick, onLogout } = props;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  // Efeito para focar no input quando necessário
  useEffect(() => {
    if (ctrl.isSearchFocused && searchInputRef.current) {
      searchInputRef.current.focus();
      ctrl.setIsSearchFocused(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl.isSearchFocused]);

  // Função para lidar com clique em item do menu no mobile
  const handleMenuItemClick = (url: string) => {
    ctrl.handleMenuItemClick(url);
    // Fecha o menu no mobile após clicar em um link
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Se for mobile, renderiza o header fixo
  if (isMobile) {
    return (
      <>
        {/* Header fixo para mobile */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border h-14 flex items-center justify-between px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(true)}
              className="h-8 w-8 text-white"
              title="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Logo centralizado */}
          <div className="flex-1 flex justify-center">
            <img
              src="/images/logo1.png"
              alt="Logo"
              className="h-8 dark:hidden"
            />
            <img
              src="/images/logo2.png"
              alt="Logo"
              className="h-8 hidden dark:block"
            />
          </div>

          {/* Botão do menu à direita */}
          <div className="flex items-center">
            <AppSidebarUser
              user={ctrl.user}
              onUserClick={onUserClick}
              onLogout={onLogout}
            />
          </div>
        </div>

        {/* Sidebar normal (será renderizada como Sheet pelo componente Sidebar) */}
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="border-sidebar-border">
            {/* Logo e nome da empresa */}
            <div className="flex items-center gap-3 px-2 py-3">
              <img
                src="/images/logo2.png"
                alt="Logo"
                className="max-h-15 m-auto"
              />
            </div>
          </SidebarHeader>

          <SidebarContent className="overflow-auto pb-6">
            {ctrl.menuGroups.map((group, groupIndex) => (
              <SidebarGroup key={groupIndex}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = ctrl.isItemActive(item.url);

                      return (
                        <SidebarMenuItem key={itemIndex}>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={() => handleMenuItemClick(item.url)}
                            className={cn(
                              "w-full justify-start h-9",
                              isActive && "bg-primary!"
                            )}
                            tooltip={item.title}
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            {/* Item especial para Webmail */}
            {!!ctrl.webmailItem && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() =>
                          handleMenuItemClick(ctrl.webmailItem.url)
                        }
                        className="w-full justify-start"
                        tooltip={ctrl.webmailItem.title}
                      >
                        <ctrl.webmailItem.icon className="h-4 w-4" />
                        <span>{ctrl.webmailItem.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>
      </>
    );
  }

  // Layout desktop (original)
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border">
        {/* Botão de collapse */}
        <div className="flex items-center justify-between px-2 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={ctrl.toggleCollapsed}
            className="h-8 w-8"
            title={ctrl.collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ctrl.CollapseIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Logo e nome da empresa */}
        <div className="flex items-center gap-3 px-2 pb-3">
          {ctrl.collapsed && (
            <>
              <img
                src="/images/logo1.png"
                alt="Logo"
                className="max-h-6 m-auto dark:hidden"
              />
              <img
                src="/images/logo2.png"
                alt="Logo"
                className="max-h-6 m-auto hidden dark:block"
              />
            </>
          )}
          {!ctrl.collapsed && (
            <>
              <img
                src="/images/logo1.png"
                alt="Logo"
                className="max-h-15 m-auto dark:hidden"
              />
              <img
                src="/images/logo2.png"
                alt="Logo"
                className="max-h-15 m-auto hidden dark:block"
              />
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="group-data-[collapsible=icon]:overflow-auto pb-6">
        {ctrl.menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel
              className={cn(
                group.title === "Administrativo Coruja" &&
                  "text-blue-500"
              )}
            >
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = ctrl.isItemActive(item.url);

                  return (
                    <SidebarMenuItem key={itemIndex}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => ctrl.handleMenuItemClick(item.url)}
                        className={cn(
                          "w-full justify-start h-9",
                          isActive && "bg-primary!",
                          group.title === "Administrativo Coruja" &&
                            "text-blue-500",
                          isActive && group.title === "Administrativo Coruja" && "bg-blue-500!",
                        )}
                        tooltip={item.title}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Item especial para Webmail */}
        {!!ctrl.webmailItem && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() =>
                      ctrl.handleMenuItemClick(ctrl.webmailItem.url)
                    }
                    className="w-full justify-start"
                    tooltip={ctrl.webmailItem.title}
                  >
                    <ctrl.webmailItem.icon className="h-4 w-4" />
                    <span>{ctrl.webmailItem.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <AppSidebarUser
          user={ctrl.user}
          onUserClick={onUserClick}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
