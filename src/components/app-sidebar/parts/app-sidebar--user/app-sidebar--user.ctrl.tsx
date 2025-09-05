import { useState } from "react";
import { 
  Moon, 
  Sun, 
  Monitor, 
  LogOut, 
  Palette, 
  Eye, 
  EyeOff,
  ChevronRight 
} from "lucide-react";
import { useTheme } from "next-themes";
import { useContrast } from "@/contexts/contrast-context";
import { AppSidebarUserProps, ThemeMode, ContrastMode } from "./app-sidebar--user.types";
import { useAuth } from "@/contexts/auth-context";

export function useAppSidebarUserCtrl(props: AppSidebarUserProps) {
  const { 
    user, 
    onUserClick, 
    onLogout 
  } = props;

  // Hooks para tema e contraste
  const { theme, setTheme } = useTheme();
  const { contrast, setContrast } = useContrast();
  const { logout } = useAuth();

  // Estado do dropdown (aberto/fechado)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<'theme' | 'contrast' | null>(null);

  // Função para alternar o dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setActiveSubmenu(null);
  };

  // Função para fechar o dropdown
  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setActiveSubmenu(null);
  };

  // Função para lidar com clique no perfil do usuário
  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick();
    }
    closeDropdown();
  };

  // Função para alternar tema
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    closeDropdown();
  };

  // Função para alternar contraste
  const handleContrastChange = (newContrast: ContrastMode) => {
    setContrast(newContrast);
    closeDropdown();
  };

  // Função para logout
  const handleLogout = () => {
    logout();
    closeDropdown();
  };

  // Função para obter iniciais do usuário para fallback do avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para obter ícone do tema
  const getThemeIcon = (themeValue: ThemeMode) => {
    switch (themeValue) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Monitor;
    }
  };

  // Função para obter label do tema
  const getThemeLabel = (themeValue: ThemeMode) => {
    switch (themeValue) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'system': return 'Sistema';
      default: return 'Sistema';
    }
  };

  // Função para obter ícone do contraste
  const getContrastIcon = (contrastValue: ContrastMode) => {
    switch (contrastValue) {
      case 'normal': return Eye;
      case 'high': return EyeOff;
      default: return Eye;
    }
  };

  // Função para obter label do contraste
  const getContrastLabel = (contrastValue: ContrastMode) => {
    switch (contrastValue) {
      case 'normal': return 'Normal';
      case 'high': return 'Alto Contraste';
      default: return 'Normal';
    }
  };

  // Opções de tema
  const themeOptions: ThemeMode[] = ['light', 'dark', 'system'];
  const contrastOptions: ContrastMode[] = ['normal', 'high'];

  // Tema atual (com fallback)
  const currentTheme = (theme as ThemeMode) || 'system';
  const currentContrast = contrast || 'normal';

  // Itens do dropdown principal
  const dropdownItems = [
    {
      icon: getThemeIcon(currentTheme),
      label: `Tema: ${getThemeLabel(currentTheme)}`,
      onClick: () => setActiveSubmenu(activeSubmenu === 'theme' ? null : 'theme'),
      hasSubmenu: true,
      isActive: activeSubmenu === 'theme',
    },
    {
      icon: getContrastIcon(currentContrast),
      label: `Contraste: ${getContrastLabel(currentContrast)}`,
      onClick: () => setActiveSubmenu(activeSubmenu === 'contrast' ? null : 'contrast'),
      hasSubmenu: true,
      isActive: activeSubmenu === 'contrast',
    },
    {
      icon: LogOut,
      label: 'Sair',
      onClick: handleLogout,
      variant: 'destructive' as const,
      hasSubmenu: false,
    },
  ];

  // Itens do submenu de tema
  const themeSubmenuItems = themeOptions.map(themeOption => ({
    icon: getThemeIcon(themeOption),
    label: getThemeLabel(themeOption),
    onClick: () => handleThemeChange(themeOption),
    isSelected: currentTheme === themeOption,
  }));

  // Itens do submenu de contraste
  const contrastSubmenuItems = contrastOptions.map(contrastOption => ({
    icon: getContrastIcon(contrastOption),
    label: getContrastLabel(contrastOption),
    onClick: () => handleContrastChange(contrastOption),
    isSelected: currentContrast === contrastOption,
  }));

  return {
    user,
    handleLogout,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    handleUserClick,
    getUserInitials,
    dropdownItems,
    activeSubmenu,
    setActiveSubmenu,
    themeSubmenuItems,
    contrastSubmenuItems,
  };
} 