import { useState, useEffect, useRef, useCallback } from 'react'
import { BulkFloatProps } from './bulk-float.types'

export function useBulkFloatCtrl(props: BulkFloatProps) {
  const { itemsSelected, onClearSelect, actions } = props
  
  // Referência para o container principal do componente
  const bulkFloatRef = useRef<HTMLDivElement>(null)
  
  // Estado para controlar se deve mostrar apenas ícones
  const [showOnlyIcons, setShowOnlyIcons] = useState(false)
  
  // Função para verificar se o componente ocupa mais de 90% da tela
  const checkComponentSize = useCallback(() => {
    if (!bulkFloatRef.current) return
    // Uma vez que ele foi para showOnlyIcons, não é necessário verificar novamente
    if(showOnlyIcons) return
    
    const component = bulkFloatRef.current
    const componentWidth = component.offsetWidth
    const screenWidth = window.innerWidth
    
    // Calcula a porcentagem da tela que o componente ocupa
    const screenOccupancyPercentage = componentWidth / screenWidth
    
    // Se o componente ocupa mais de 90% da largura da tela, mostrar apenas ícones
    // Isso garante que o componente não fique muito largo em telas pequenas
    const shouldShowOnlyIcons = screenOccupancyPercentage > 0.9
    setShowOnlyIcons(shouldShowOnlyIcons)
  }, [showOnlyIcons])
  
  // Efeito para verificar o tamanho quando o componente monta ou as ações mudam
  useEffect(() => {
    // Usar requestAnimationFrame para garantir que o DOM foi renderizado
    const checkAfterRender = () => {
      requestAnimationFrame(() => {
        checkComponentSize()
      })
    }
    
    checkAfterRender()
    
    // Adicionar listener para redimensionamento da janela
    const handleResize = () => {
      checkAfterRender()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [actions, showOnlyIcons, checkComponentSize])
  
  // Função para executar uma ação
  const handleActionClick = (action: typeof actions[0]) => {
    action.onClick()
  }
  
  // Função para limpar seleção
  const handleClearSelection = () => {
    onClearSelect()
  }
  
  return {
    // Estados
    showOnlyIcons,
    
    // Refs
    bulkFloatRef,
    
    // Dados computados
    selectedCount: itemsSelected,
    hasSelectedItems: itemsSelected > 0,
    
    // Funções
    handleActionClick,
    handleClearSelection,
    checkComponentSize,
  }
} 