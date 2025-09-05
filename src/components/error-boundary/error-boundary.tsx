"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  isRetrying: boolean;
  currentPath?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isRetrying: false,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : ''
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  handleReset = async () => {
    this.setState({ isRetrying: true });
    
    // Delay de 1 segundo antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      isRetrying: false 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6">
              <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
            </div>
            
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Ops! Algo deu errado
            </h1>
            
            <p className="mb-2 text-muted-foreground">
              Ocorreu um erro inesperado na rota <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{this.state.currentPath}</code>.
            </p>
            
            <p className="mb-6 text-muted-foreground">
              Tente recarregar a página ou entre em contato com o suporte se o problema persistir.
            </p>

            {this.state.error && (
              <div className="mb-6 rounded-md bg-destructive/10 p-4 text-left">
                <h3 className="mb-2 text-sm font-semibold text-destructive">
                  Detalhes do erro:
                </h3>
                <pre className="text-xs text-destructive/80 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button 
                onClick={this.handleReset} 
                variant="outline"
                disabled={this.state.isRetrying}
                className="gap-2"
              >
                {this.state.isRetrying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Tentando...
                  </>
                ) : (
                  'Tentar Novamente'
                )}
              </Button>
              
              <Button onClick={this.handleReload} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
