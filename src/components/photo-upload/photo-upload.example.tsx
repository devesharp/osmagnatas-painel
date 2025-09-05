import React, { useState } from "react";
import { PhotoUpload } from "./photo-upload";
import { PhotoFile } from "./photo-upload.types";

/**
 * Exemplo de uso do PhotoUpload com controle externo
 * Demonstra como gerenciar o estado das fotos externamente
 */
export function PhotoUploadControlledExample() {
  // Estado externo das fotos
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  // Função de upload mock (substitua pela sua implementação real)
  const handleUpload = async (file: File): Promise<void> => {
    // Simula delay do upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula possível erro (10% de chance)
    if (Math.random() < 0.1) {
      throw new Error("Erro simulado no upload");
    }
    
    console.log("Arquivo enviado:", file.name);
  };

  // Handler para mudanças nas fotos
  const handlePhotosChange = (newPhotos: PhotoFile[]) => {
    setPhotos(newPhotos);
    console.log("Fotos atualizadas:", newPhotos);
  };

  // Handler para mudanças de status
  const handleStatusChange = (fileId: string, status: string, error?: string) => {
    console.log(`Foto ${fileId} mudou para status: ${status}`, error);
  };

  // Adiciona uma foto existente manualmente (exemplo)
  const addExistingPhoto = () => {
    const existingPhoto: PhotoFile = {
      id: `existing-${Date.now()}`,
      preview: "https://picsum.photos/300/200?random=" + Math.random(),
      status: "success",
      progress: 100,
    };
    setPhotos(prev => [...prev, existingPhoto]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Upload de Fotos (Controlado)</h2>
        
        <PhotoUpload
          value={photos}
          onChangeValue={handlePhotosChange}
          onUpload={handleUpload}
          onFileStatusChange={handleStatusChange}
          maxFiles={5}
          maxFileSize={2 * 1024 * 1024} // 2MB
          acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
        />
      </div>

      {/* Debug: Estado atual das fotos */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Estado atual das fotos:</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(
            photos.map(photo => ({
              id: photo.id,
              status: photo.status,
              progress: photo.progress,
              error: photo.error,
              fileName: photo.file?.name || 'Foto existente'
            })),
            null,
            2
          )}
        </pre>
      </div>

      {/* Botões de controle para demonstração */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setPhotos([])}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Limpar todas as fotos
        </button>
        
        <button
          onClick={() => {
            const successPhotos = photos.filter(p => p.status === 'success');
            console.log("Fotos prontas para envio:", successPhotos);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Obter fotos prontas
        </button>

        <button
          onClick={addExistingPhoto}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar foto existente
        </button>

        <button
          onClick={() => setPhotos(photos.filter(p => p.status !== 'error'))}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Remover fotos com erro
        </button>
      </div>
    </div>
  );
}

/**
 * Exemplo de uso do PhotoUpload com modo tradicional (não controlado)
 * Para compatibilidade com código existente
 */
export function PhotoUploadUncontrolledExample() {
  const handleUpload = async (file: File): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Upload concluído:", file.name);
  };

  const handlePhotosReorder = (photos: PhotoFile[]) => {
    console.log("Fotos reordenadas:", photos.map(p => p.id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Upload de Fotos (Não Controlado)</h2>
        
        <PhotoUpload
          onUpload={handleUpload}
          onPhotosReorder={handlePhotosReorder}
          maxFiles={10}
        />
      </div>
    </div>
  );
} 