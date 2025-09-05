import { useState, useEffect, useCallback, useRef } from 'react';
import { jobApi, JobStatusRequest, JobStatusResponse } from '@/api/jobs.request';
import useDeepEffect from '@lucarestagno/use-deep-effect';

interface UseJobStatusProps {
  tags: string[];
  enabled?: boolean;
  onSuccess?: (data: JobStatusResponse['job']) => void;
  onFailed?: (data: JobStatusResponse['job']) => void;
  interval?: number;
}

interface UseJobStatusReturn {
  isPending: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  isEmpty: boolean;
  data?: JobStatusResponse['job'];
  onCheckStatus: () => void;
}

const POLLING_INTERVAL = 5; // 5 segundos

export function useJobStatus({
  tags,
  enabled = false,
  onSuccess,
  onFailed,
  interval = POLLING_INTERVAL,
}: UseJobStatusProps): UseJobStatusReturn {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [data, setData] = useState<JobStatusResponse['job'] | undefined>();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isEnabledRef = useRef(enabled);
  const shouldStopPollingRef = useRef(false);

  // Função para resetar todos os estados para os valores iniciais
  const resetStates = useCallback(() => {
    setIsPending(false);
    setIsSuccess(false);
    setIsFailed(false);
    setIsEmpty(true);
    setData(undefined);
    shouldStopPollingRef.current = false;
  }, []);

  // Função para parar o polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Função para verificar o status do job
  const checkJobStatus = useCallback(async () => {
    if (!tags.length) return;

    try {
      const request: JobStatusRequest = { tags };
      const response = await jobApi.getStatus(request);

      if (!response) {
        setIsEmpty(true);
        setIsPending(false);
        setIsSuccess(false);
        setIsFailed(false);
        setData(undefined);
        return;
      }

      setData(response.job);
      setIsEmpty(false);

      const status = response.job?.status?.toLowerCase();

      switch (status) {
        case 'pending':
        case 'running':
          setIsPending(true);
          setIsSuccess(false);
          setIsFailed(false);
          break;

        case 'completed':
          setIsPending(false);
          setIsSuccess(true);
          setIsFailed(false);
          shouldStopPollingRef.current = true;
          stopPolling();
          onSuccess?.(response.job);
          break;

        case 'failed':
          setIsPending(false);
          setIsSuccess(false);
          setIsFailed(true);
          shouldStopPollingRef.current = true;
          stopPolling();
          onFailed?.(response.job);
          break;

        default:
          setIsPending(false);
          setIsSuccess(false);
          setIsFailed(false);
          shouldStopPollingRef.current = true;
          stopPolling();
          break;
      }
    } catch (error) {
      // Em caso de erro na request, não mostra erro, apenas continua tentando
      // Os estados permanecem como estão
      console.debug('Erro ao verificar status do job:', error);
    }
  }, [tags, onSuccess, onFailed, stopPolling]);

  // Função para forçar verificação manual
  const onCheckStatus = useCallback(() => {
    resetStates();
    startPolling();
  }, [resetStates, checkJobStatus]);

  // Função para iniciar o polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Verifica imediatamente
    checkJobStatus();

    // Inicia o polling
    intervalRef.current = setInterval(() => {
      if (isEnabledRef.current && !shouldStopPollingRef.current) {
        checkJobStatus();
      }
    }, interval * 1000);
  }, [checkJobStatus, stopPolling]);

  // Efeito para controlar o polling baseado no enabled e mudanças nas tags
  useDeepEffect(() => {
    isEnabledRef.current = enabled;

    if (enabled && tags.length > 0) {
      // Se as tags mudaram, reseta o estado e reinicia o polling
      resetStates();
      startPolling();
    } else {
      stopPolling();
      resetStates();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, tags]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    isPending,
    isSuccess,
    isFailed,
    isEmpty,
    data,
    onCheckStatus,
  };
} 