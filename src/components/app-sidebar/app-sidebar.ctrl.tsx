import {
  Home,
  Building2,
  Plus,
  Search,
  Users,
  MessageSquare,
  Image,
  FileText,
  Palette,
  Settings,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Table,
  Share2,
  Link,
  Megaphone,
  Download,
  Shield,
  Database,
  List,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { AppSidebarProps, MenuGroup, MenuItem } from "./app-sidebar.types";
import { useAuth } from "@/contexts/auth-context";

function Orulo() {
  return (
    <svg
      viewBox="0 0 126 183"
      fill="#FFF"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-background-light"
      width="80"
      height="40"
    >
      <g clipPath="url(#orulo_svg__a)">
        <path d="M132.23 116.76c0 36.6-25 66.24-66.25 66.24S0 153.36 0 116.76c0-36.34 25.26-66.24 65.73-66.24s66.5 29.9 66.5 66.24Zm-100.78 0c0 19.33 11.59 37.37 34.53 37.37s34.54-18 34.54-37.37c0-19.07-13.4-37.63-34.54-37.63-22.68 0-34.53 18.56-34.53 37.63ZM183 53.1l2.32 14.69c9.79-15.72 22.94-18 35.82-18 13.15 0 25.78 5.15 32.74 12.11L239.7 89.18c-6.44-5.41-12.37-8.25-22.68-8.25-16.5 0-31.7 8.77-31.7 32.22v67h-31.45V53.1H183ZM453.88 0v180.17H422.7V0h31.18ZM607.76 116.76c0 36.6-25 66.24-66.24 66.24-41.24 0-66-29.64-66-66.24 0-36.34 25.26-66.24 65.73-66.24s66.51 29.9 66.51 66.24Zm-100.78 0c0 19.33 11.6 37.37 34.54 37.37 22.94 0 34.54-18 34.54-37.37 0-19.07-13.41-37.63-34.54-37.63-22.69 0-34.52 18.56-34.52 37.63h-.02ZM107.59 45.38c9.665 0 17.5-7.835 17.5-17.5s-7.835-17.5-17.5-17.5-17.5 7.835-17.5 17.5 7.835 17.5 17.5 17.5ZM332.52 183c23.78 0 42.16-9.86 53.45-25.24 5.81-9.93 9.12-22.68 9.12-37.91V53.1h-31.44v66.5c0 19.33-10.57 34-30.67 34h-1.77c-20.11 0-30.67-14.69-30.67-34V53.1h-31.46v66.75c0 11.58 1.92 21.72 5.38 30.28C284.84 169.79 305 183 332.52 183Z"></path>
      </g>
      <defs>
        <clipPath id="orulo_svg__a">
          <path fill="#fff" d="M0 0h607.76v183H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

function Studio360() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
    >
      <rect width="24" height="24" rx="4" fill="currentColor" opacity="0.1" />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="12"
        y="20"
        textAnchor="middle"
        fill="currentColor"
        fontSize="4"
        fontWeight="bold"
      >
        360
      </text>
    </svg>
  );
}

export function useAppSidebarCtrl(props: AppSidebarProps) {
  const {
    user,
    onMenuItemClick,
    onUserClick,
    currentPath,
    defaultCollapsed = false,
    collapsed: controlledCollapsed,
    onCollapsedChange,
  } = props;

  const { user: userAuth } = useAuth();

  // Usa o contexto do SidebarProvider
  const { open, setOpen, toggleSidebar: sidebarToggle } = useSidebar();

  // O estado collapsed é o inverso do open (open = true significa expandido)
  const collapsed = !open;

  // Estado para a busca geral
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sincroniza o estado inicial se defaultCollapsed for fornecido
  useEffect(() => {
    if (
      defaultCollapsed !== undefined &&
      open === true &&
      defaultCollapsed === true
    ) {
      setOpen(false);
    }
  }, [defaultCollapsed, open, setOpen]);

  // Sincroniza com controle externo se fornecido
  useEffect(() => {
    if (controlledCollapsed !== undefined) {
      const shouldBeOpen = !controlledCollapsed;
      if (open !== shouldBeOpen) {
        setOpen(shouldBeOpen);
      }
    }
  }, [controlledCollapsed, open, setOpen]);

  // Notifica mudanças de estado para controle externo
  useEffect(() => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  // Função para alternar o estado de collapse
  const toggleCollapsed = () => {
    sidebarToggle();
  };

  // Dados do menu organizados por grupos
  const menuGroups: MenuGroup[] = [
    {
      title: "Principal",
      items: [
        {
          title: "Resumo",
          url: "/",
          icon: Home,
        },
        {
          title: "Transações",
          icon: Database,
          url: "/transactions",
        },
        {
          title: "Inadimplências",
          icon: List,
          url: "/inadimplencia/listing",
        },
        {
          title: "Clientes",
          icon: Users,
          url: "/customers",
        },
        {
          title: "Auditoria",
          icon: FileText,
          url: "/logs",
        },
      ],
    },
  ].filter(Boolean) as MenuGroup[];

  // Item especial para webmail (link externo)
  const webmailItem = userAuth?.WEBSITE && {
    title: "Webmail",
    url: `//webmail.${userAuth?.WEBSITE}`,
    icon: Mail,
  };

  // Função para verificar se um item está ativo
  const isItemActive = (url: string): boolean => {
    if (!currentPath) return false;
    if (url === "/" && currentPath === "/") return true;
    if (url !== "/" && currentPath.startsWith(url)) return true;
    return false;
  };


  // Função para lidar com clique em item do menu
  const handleMenuItemClick = (url: string) => {
    // Se for link externo (webmail), abre em nova aba
    if (url.startsWith("//")) {
      window.open(`https:${url}`, "_blank");
      return;
    }

    // Chama função personalizada se fornecida
    if (onMenuItemClick) {
      onMenuItemClick(url);
    }
  };

  // Função para lidar com clique no usuário
  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick();
    }
  };

  // Função para obter iniciais do usuário para fallback do avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Ícone do botão de collapse baseado no estado atual
  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  // Função para lidar com a busca geral
  const handleSearch = (term: string) => {
    if (term.trim()) {
      const searchUrl = `/properties/listing?BUSCA_GERAL=${encodeURIComponent(
        term.trim()
      )}`;

      // Chama função personalizada se fornecida
      if (onMenuItemClick) {
        onMenuItemClick(searchUrl);
      }

      // Limpa o input após a busca
      setSearchTerm("");
    }
  };

  // Função para lidar com o submit do formulário de busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  // Função para lidar com mudança no input de busca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Função para lidar com tecla Enter no input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  };

  // Função para focar no input de busca quando collapsed
  const handleSearchButtonClick = () => {
    if (collapsed) {
      // Expande o sidebar primeiro
      setOpen(true);
      // Foca no input após um pequeno delay para permitir a animação
      setTimeout(() => {
        setIsSearchFocused(true);
      }, 150);
    }
  };

  return {
    menuGroups,
    webmailItem,
    collapsed,
    toggleCollapsed,
    CollapseIcon,
    isItemActive,
    handleMenuItemClick,
    handleUserClick,
    getUserInitials,
    user,
    // Busca geral
    searchTerm,
    isSearchFocused,
    setIsSearchFocused,
    handleSearch,
    handleSearchSubmit,
    handleSearchChange,
    handleSearchKeyDown,
    handleSearchButtonClick,
  };
}
