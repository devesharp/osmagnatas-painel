import React, { useState } from 'react';
import { useJobStatus } from './use-job-status';

// Exemplo de como usar o hook useJobStatus
export function JobStatusExample() {
  const [tags, setTags] = useState<string[]>(['example-job']);
  const [enabled, setEnabled] = useState(false);

  const {
    isPending,
    isSuccess,
    isFailed,
    isEmpty,
    data,
    onCheckStatus,
  } = useJobStatus({
    tags,
    enabled,
    onSuccess: (data) => {
      console.log('Job concluído com sucesso:', data);
      // Aqui você pode executar ações quando o job for concluído
    },
    onFailed: (data) => {
      console.log('Job falhou:', data);
      // Aqui você pode executar ações quando o job falhar
    },
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Status do Job</h2>
      
      {/* Controles */}
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Tags do Job:</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Digite as tags separadas por vírgula"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="mr-2"
            />
            Habilitar verificação automática (a cada 5s)
          </label>
          
          <button
            onClick={onCheckStatus}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Verificar Status Manualmente
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-3 rounded ${isPending ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-100'}`}>
          <div className="text-sm font-medium">Pendente/Executando</div>
          <div className="text-lg">{isPending ? '✓' : '✗'}</div>
        </div>
        
        <div className={`p-3 rounded ${isSuccess ? 'bg-green-100 border-green-400' : 'bg-gray-100'}`}>
          <div className="text-sm font-medium">Sucesso</div>
          <div className="text-lg">{isSuccess ? '✓' : '✗'}</div>
        </div>
        
        <div className={`p-3 rounded ${isFailed ? 'bg-red-100 border-red-400' : 'bg-gray-100'}`}>
          <div className="text-sm font-medium">Falhou</div>
          <div className="text-lg">{isFailed ? '✓' : '✗'}</div>
        </div>
        
        <div className={`p-3 rounded ${isEmpty ? 'bg-gray-100 border-gray-400' : 'bg-blue-100'}`}>
          <div className="text-sm font-medium">Vazio</div>
          <div className="text-lg">{isEmpty ? '✓' : '✗'}</div>
        </div>
      </div>

      {/* Dados do Job */}
      {data && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Dados do Job:</h3>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Status Text */}
      <div className="mt-4 p-3 border rounded">
        <div className="text-sm font-medium mb-1">Status Atual:</div>
        <div className="text-sm">
          {isEmpty && 'Nenhum job encontrado'}
          {isPending && `Job "${data?.name}" está ${data?.status === 'pending' ? 'pendente' : 'executando'}`}
          {isSuccess && `Job "${data?.name}" foi concluído com sucesso`}
          {isFailed && `Job "${data?.name}" falhou`}
        </div>
      </div>
    </div>
  );
} 