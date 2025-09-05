import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { registerModalFunctions } from '@/components/confirmation';

interface Modal {
  content: ReactNode;
  props: Record<string, unknown>;
  isOpen: boolean;
}

interface ModalManager {
  modals: Record<string, Modal>;
  openModal: (id: string, content: ReactNode, props?: Record<string, unknown>) => void;
  closeModal: (id: string) => void;
}

const ModalContext = createContext<ModalManager | undefined>(undefined);

const useModalManager = (): ModalManager => {
  const [modals, setModals] = useState<Record<string, Modal>>({});

  const openModal = (id: string, content: ReactNode, props: Record<string, unknown> = {}) => {
    setModals(prev => ({ ...prev, [id]: { content, props, isOpen: true } }));
  };

  const closeModal = (id: string) => {
    setModals(prev => {
      const { [id]: _, ...remainingModals } = prev;
      return remainingModals;
    });
  };

  return { modals, openModal, closeModal };
};

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  const modalManager = useModalManager();

  // Registrar as funções globais de modal para o sistema de confirmação
  useEffect(() => {
    registerModalFunctions(modalManager.openModal, modalManager.closeModal);
  }, [modalManager.openModal, modalManager.closeModal]);

  return (
    <ModalContext.Provider value={modalManager}>
      {children}
      {Object.entries(modalManager.modals).map(([id, modal]) => (
        modal.isOpen && (
          <div 
            key={id} 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Fechar modal se clicar no backdrop
              if (e.target === e.currentTarget) {
                modalManager.closeModal(id);
              }
            }}
          >
            <div 
              className="relative max-w-lg w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {modal.content}
            </div>
          </div>
        )
      ))}
    </ModalContext.Provider>
  );
};

const useModal = (): ModalManager => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};

export { ModalProvider, useModal };