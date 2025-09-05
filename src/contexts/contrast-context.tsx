"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ContrastMode = 'normal' | 'high';

interface ContrastContextType {
  contrast: ContrastMode;
  setContrast: (contrast: ContrastMode) => void;
}

const ContrastContext = createContext<ContrastContextType | undefined>(undefined);

interface ContrastProviderProps {
  children: React.ReactNode;
  defaultContrast?: ContrastMode;
}

export function ContrastProvider({ 
  children, 
  defaultContrast = 'normal' 
}: ContrastProviderProps) {
  const [contrast, setContrastState] = useState<ContrastMode>(defaultContrast);

  // Carregar contraste do localStorage na inicialização
  useEffect(() => {
    const savedContrast = localStorage.getItem('contrast') as ContrastMode;
    if (savedContrast && (savedContrast === 'normal' || savedContrast === 'high')) {
      setContrastState(savedContrast);
    }
  }, []);

  // Aplicar contraste ao documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes de contraste existentes
    root.classList.remove('contrast-normal', 'contrast-high');
    
    // Adicionar nova classe de contraste
    root.classList.add(`contrast-${contrast}`);
    
    // Salvar no localStorage
    localStorage.setItem('contrast', contrast);
  }, [contrast]);

  const setContrast = (newContrast: ContrastMode) => {
    setContrastState(newContrast);
  };

  return (
    <ContrastContext.Provider value={{ contrast, setContrast }}>
      {children}
    </ContrastContext.Provider>
  );
}

export function useContrast() {
  const context = useContext(ContrastContext);
  if (context === undefined) {
    throw new Error('useContrast must be used within a ContrastProvider');
  }
  return context;
} 