import { ReactNode } from 'react'

/**
 * Ação disponível no BulkFloat
 */
export interface BulkFloatAction {
  /** Ícone da ação (opcional) - componente React ou string */
  icon?: ReactNode
  /** Título da ação que será exibido */
  title: string
  /** Função executada ao clicar na ação */
  onClick: () => void
}

/**
 * Props do componente BulkFloat
 */
export interface BulkFloatProps {
  /** Número de itens selecionados para exibir a quantidade */
  itemsSelected: number
  /** Função para limpar a seleção de itens */
  onClearSelect: () => void
  /** Array de ações disponíveis no componente */
  actions: BulkFloatAction[]
  /** Classe CSS adicional (opcional) */
  className?: string
} 