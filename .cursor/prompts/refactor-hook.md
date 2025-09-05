# Refactor hook

Estrutura e Organização
1.	Localização e nomeação
	•	Hooks devem ser criados dentro da pasta logic (ex: ./logic/use-xyz.ts).
	•	O nome do arquivo deve sempre começar com use- e ser descritivo.
	•	Hooks utilizados apenas dentro de um único componente devem estar na pasta logic dentro da pasta do componente.
	•	Hooks compartilhados devem estar na pasta src/hooks.
2.	Propósito único e segmentado
	•	Cada hook deve ter uma única responsabilidade.
	•	Se o hook estiver ficando grande ou com responsabilidades distintas, quebre-o em múltiplos hooks menores sempre mantendo o nome do pai. Exemplo 'use-hook--listeners.tsx'
	•	Evite misturar lógica de dados, estado e efeitos colaterais no mesmo hook — separe por domínio (ex: useTodoFilter, useTodoApi, etc.).

⸻

Código e Estilo
	3.	Padrão e composição
	•	Sempre use camelCase para variáveis e funções.
	•	Exporte o hook como função tradicional (não como arrow function).
	•	Sempre retorne apenas o que for necessário: evite retornar tudo por padrão.
	•	Agrupe os retornos por semântica (ex: { value, setValue }, { data, isLoading, refetch }).
	4.	Comentários
	•	Comente de forma sucinta o que cada variável e função faz dentro do hook.
	•	Evite comentários óbvios. Comente para clareza funcional, não para repetir o código.

⸻

Integração e testes
	5.	Integração com componentes
	•	Se o hook for usado como controller de um componente, siga o padrão:

export function componentNameCtrl(props: ComponentNameProps) {
  const state = useComponentName(props);
  return { ...state };
}


	•	O controller deve apenas compor os hooks — sem lógica duplicada.

	6.	Testes
	•	Hooks com lógica de estado ou efeitos (fetch, debounce, timers) devem ter testes unitários em __tests__/use-xyz.test.ts.
	•	Use @testing-library/react-hooks ou equivalente para testar comportamento.

⸻

Exemplos e uso
	7.	Evitar acoplamento
	•	Hooks devem ser agnósticos à UI sempre que possível.
	•	Não inclua useEffect que manipula document ou DOM diretamente, exceto em casos extremamente controlados.
	8.	Nomeclatura consistente
	•	Prefixos:
	•	useSomething → padrão geral
	•	useXyzState → controla estado
	•	useXyzEffect → efeitos colaterais
	•	useXyzApi → chamadas de API
	•	useXyzCtrl → controller de componente

⸻

✅ Exemplo mínimo de estrutura

// ./logic/use-counter.ts
import { useState } from 'react';

/**
 * Controla o contador simples com incremento e reset.
 */
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  // Incrementa o contador em 1
  function increment() {
    setCount((c) => c + 1);
  }

  // Reseta o contador para o valor inicial
  function reset() {
    setCount(initial);
  }

  return { count, increment, reset };
}