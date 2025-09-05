import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { UsuarioImagemProps, UsuarioImagemRef } from "./usuario-imagem.types";
import { UsuarioImagemCtrl } from "./usuario-imagem.ctrl";
import { Upload, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingForeground } from "@/components/loading-foreground";

/**
 * Componente UsuarioImagem
 *
 * Permite upload e exibição de imagem do usuário com otimização automática:
 * - Redimensionamento para 300x300px mantendo proporção
 * - Conversão para JPG com qualidade 85%
 * - Resultado final em base64
 *
 * Exemplo de uso:
 * ```tsx
 * <UsuarioImagem
 *   value={viewForm.resource.CORRETOR?.IMAGEM}
 *   onChange={(value) => handleImageChange(value)}
 * />
 * ```
 */
export const UsuarioImagem = forwardRef<UsuarioImagemRef, UsuarioImagemProps>((props, ref) => {
  const {
    className,
    disabled = false,
    uploadButtonText = "Alterar Foto",
    placeholder = "Clique para adicionar foto",
    ...restProps
  } = props;

  const ctrl = UsuarioImagemCtrl(restProps);

  // Expõe métodos através da ref
  useImperativeHandle(ref, () => ({
    openFileSelector: ctrl.handleClick,
  }), [ctrl.handleClick]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Input de arquivo oculto */}
      <input
        ref={ctrl.fileInputRef}
        type="file"
        accept="image/*"
        onChange={ctrl.handleFileChange}
        className="hidden"
        disabled={disabled || ctrl.isLoading}
      />

      {/* Container da imagem */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* Imagem ou placeholder */}
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
            {ctrl.isLoading ? (
              <LoadingForeground visible={true} />
            ) : ctrl.hasImage ? (
              <img
                src={props.value}
                alt="Foto do usuário"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Erro ao carregar imagem");
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <User className="w-8 h-8 mb-2" />
                <span className="text-xs text-center px-2">{placeholder}</span>
              </div>
            )}
          </div>

          {/* Botão de remover (apenas se houver imagem) */}
          {ctrl.hasImage && !disabled && !ctrl.isLoading && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full"
              onClick={ctrl.handleRemove}
              title="Remover foto"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Botão de upload/alterar */}
        {!disabled && (
          <Button
            variant="outline"
            onClick={ctrl.handleClick}
            disabled={ctrl.isLoading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {ctrl.hasImage ? uploadButtonText : "Adicionar Foto"}
          </Button>
        )}
      </div>
    </div>
  );
});

UsuarioImagem.displayName = "UsuarioImagem";
