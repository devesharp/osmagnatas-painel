import { useCallback, useRef, useState } from "react";
import { UsuarioImagemProps } from "./usuario-imagem.types";

export function UsuarioImagemCtrl(props: UsuarioImagemProps) {
  const { value, onChange, onRemove, disabled } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** Redimensiona imagem usando canvas */
  const resizeImage = useCallback((file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcula as novas dimensões mantendo a proporção
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Define o tamanho do canvas
        canvas.width = width;
        canvas.height = height;

        // Desenha a imagem redimensionada no canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Converte para base64 JPG
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  });

  /** Manipula o clique no botão de upload */
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  /** Manipula a mudança no input de arquivo */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Verifica se é uma imagem
      if (!file.type.startsWith("image/")) {
        console.error("Arquivo selecionado não é uma imagem");
        return;
      }

      // Verifica tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error("Arquivo muito grande. Máximo: 5MB");
        return;
      }

      setIsLoading(true);

      try {
        const base64 = await resizeImage(file, 300, 300, 0.85);
        onChange?.(base64);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      } finally {
        setIsLoading(false);
        // Limpa o input para permitir selecionar o mesmo arquivo novamente
        event.target.value = "";
      }
    },
    [onChange, resizeImage]
  );

  /** Remove a imagem atual */
  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove();
    } else {
      onChange?.(undefined);
    }
  }, [onChange, onRemove]);

  /** Verifica se há imagem */
  const hasImage = Boolean(value);

  return {
    // Refs
    fileInputRef,

    // States
    isLoading,
    hasImage,

    // Handlers
    handleClick,
    handleFileChange,
    handleRemove,
  };
}
