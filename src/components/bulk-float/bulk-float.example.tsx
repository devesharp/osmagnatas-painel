'use client'

import { useState } from 'react'
import { Edit, Trash2, Download, Share, Eye } from 'lucide-react'
import { BulkFloat } from './bulk-float'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface ExampleItem {
  id: number
  name: string
  selected: boolean
}

export function BulkFloatExample() {
  const [items, setItems] = useState<ExampleItem[]>([
    { id: 1, name: 'Item 1', selected: false },
    { id: 2, name: 'Item 2', selected: false },
    { id: 3, name: 'Item 3', selected: false },
    { id: 4, name: 'Item 4', selected: false },
    { id: 5, name: 'Item 5', selected: false },
  ])

  // Função para alternar seleção de um item
  const toggleItemSelection = (id: number) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  // Função para selecionar todos os itens
  const selectAllItems = () => {
    setItems(prev => prev.map(item => ({ ...item, selected: true })))
  }

  // Função para limpar seleção
  const clearSelection = () => {
    setItems(prev => prev.map(item => ({ ...item, selected: false })))
  }

  // Obter itens selecionados
  const selectedItems = items.filter(item => item.selected)
  const selectedCount = selectedItems.length

  // Ações disponíveis
  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      title: 'Visualizar',
      onClick: () => {
        alert(`Visualizando ${selectedItems.length} itens`)
      },
    },
    {
      icon: <Edit className="h-4 w-4" />,
      title: 'Editar',
      onClick: () => {
        alert(`Editando ${selectedItems.length} itens`)
      },
    },
    {
      icon: <Download className="h-4 w-4" />,
      title: 'Baixar',
      onClick: () => {
        alert(`Baixando ${selectedItems.length} itens`)
      },
    },
    {
      icon: <Share className="h-4 w-4" />,
      title: 'Compartilhar',
      onClick: () => {
        alert(`Compartilhando ${selectedItems.length} itens`)
      },
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      title: 'Excluir',
      onClick: () => {
        if (confirm(`Deseja excluir ${selectedItems.length} itens?`)) {
          setItems(prev => prev.filter(item => !item.selected))
        }
      },
    },
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Exemplo do BulkFloat</h2>
      
      <div className="mb-4">
        <Button onClick={selectAllItems} variant="outline" size="sm">
          Selecionar Todos
        </Button>
      </div>

      <div className="space-y-2 mb-8">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50"
          >
            <Checkbox
              checked={item.selected}
              onCheckedChange={() => toggleItemSelection(item.id)}
            />
            <span className="flex-1">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {selectedItems.length > 0 ? (
          <p>
            {selectedItems.length} de {items.length} itens selecionados
          </p>
        ) : (
          <p>Nenhum item selecionado</p>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Instruções:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Selecione um ou mais itens para ver o BulkFloat aparecer</li>
          <li>Redimensione a janela para ver o comportamento responsivo</li>
          <li>Quando o componente ocupar mais de 90% da tela, apenas os ícones são mostrados com tooltips</li>
          <li>Use o botão X para limpar a seleção</li>
        </ul>
      </div>

      {/* Componente BulkFloat */}
      <BulkFloat
        itemsSelected={selectedCount}
        onClearSelect={clearSelection}
        actions={actions}
      />
    </div>
  )
} 