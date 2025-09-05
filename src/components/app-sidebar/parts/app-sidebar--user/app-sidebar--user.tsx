import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, ChevronRight, Check } from "lucide-react";
import { AppSidebarUserProps } from "./app-sidebar--user.types";
import { useAppSidebarUserCtrl } from "./app-sidebar--user.ctrl";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebarUser(props: AppSidebarUserProps) {
  const ctrl = useAppSidebarUserCtrl(props);
  const isMobile = useIsMobile();

  // Versão mobile compacta - apenas avatar com dropdown
  if (isMobile) {
    return (
      <DropdownMenu
        open={ctrl.isDropdownOpen}
        onOpenChange={ctrl.toggleDropdown}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-6 w-6 p-0"
            title={`Perfil de ${ctrl.user.name}`}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={ctrl.user.avatar} alt={ctrl.user.name} />
              <AvatarFallback className="text-xs">
                {ctrl.getUserInitials(ctrl.user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {/* Informações do usuário */}
          <div className="px-2 py-2 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={ctrl.user.avatar} alt={ctrl.user.name} />
                <AvatarFallback className="text-xs">
                  {ctrl.getUserInitials(ctrl.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="block w-full text-sm font-medium truncate">
                  {ctrl.user.name}
                </span>
                {ctrl.user.email && (
                  <span className="block w-full text-xs text-muted-foreground truncate">
                    {ctrl.user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submenu de Tema */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {React.createElement(ctrl.dropdownItems[0].icon, {
                className: "mr-2 h-4 w-4",
              })}
              {ctrl.dropdownItems[0].label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {ctrl.themeSubmenuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  {React.createElement(item.icon, {
                    className: "mr-2 h-4 w-4",
                  })}
                  {item.label}
                  {item.isSelected && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Submenu de Contraste */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {React.createElement(ctrl.dropdownItems[1].icon, {
                className: "mr-2 h-4 w-4",
              })}
              {ctrl.dropdownItems[1].label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {ctrl.contrastSubmenuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  {React.createElement(item.icon, {
                    className: "mr-2 h-4 w-4",
                  })}
                  {item.label}
                  {item.isSelected && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={ctrl.dropdownItems[2].onClick}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            {React.createElement(ctrl.dropdownItems[2].icon, {
              className: "mr-2 h-4 w-4",
            })}
            {ctrl.dropdownItems[2].label}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Versão desktop (original)
  return (
    <div className="p-0 h-14">
      <div className="flex items-center">
        {/* Botão do perfil do usuário */}
        <div
          variant="ghost"
          className="flex-1 justify-start h-auto p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 flex overflow-hidden !pr-0 gap-1"
          onClick={ctrl.handleUserClick}
          title={`Perfil de ${ctrl.user.name}`}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={ctrl.user.avatar} alt={ctrl.user.name} />
            <AvatarFallback className="text-xs">
              {ctrl.getUserInitials(ctrl.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-2 min-w-0 flex-1 group-data-[collapsible=icon]:hidden flex-1 overflow-hidden">
            <span className="block w-full text-sm font-medium text-sidebar-foreground truncate text-left">
              {ctrl.user.name}
            </span>
            {ctrl.user.email && (
              <span
                className="block w-full truncate text-left text-red-500 cursor-pointer"
                onClick={() => ctrl.handleLogout()}
              >
                Sair
              </span>
            )}
          </div>
        </div>

        {/* Dropdown de configurações */}
        <DropdownMenu
          open={ctrl.isDropdownOpen}
          onOpenChange={ctrl.toggleDropdown}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              title="Configurações"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Submenu de Tema */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {React.createElement(ctrl.dropdownItems[0].icon, {
                  className: "mr-2 h-4 w-4",
                })}
                {ctrl.dropdownItems[0].label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {ctrl.themeSubmenuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className="cursor-pointer"
                  >
                    {React.createElement(item.icon, {
                      className: "mr-2 h-4 w-4",
                    })}
                    {item.label}
                    {item.isSelected && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Submenu de Contraste */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {React.createElement(ctrl.dropdownItems[1].icon, {
                  className: "mr-2 h-4 w-4",
                })}
                {ctrl.dropdownItems[1].label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {ctrl.contrastSubmenuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className="cursor-pointer"
                  >
                    {React.createElement(item.icon, {
                      className: "mr-2 h-4 w-4",
                    })}
                    {item.label}
                    {item.isSelected && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={ctrl.dropdownItems[2].onClick}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              {React.createElement(ctrl.dropdownItems[2].icon, {
                className: "mr-2 h-4 w-4",
              })}
              {ctrl.dropdownItems[2].label}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
