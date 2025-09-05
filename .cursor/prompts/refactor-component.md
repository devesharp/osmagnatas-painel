# Create component

## Refatoração

1. Lógica e estrutura
  - Sempre mantenha a lógica dentro do `./component-name.ctrl.tsx`, caso precisa de alguma lógica e o componente não exista crie-o e exporte como `const ctrl = componentNameCtrl(props)`.
  - O componente deve ser um componente funcional e sempre exportado como função e não arrow function.
2. Estilização
  - Usar sempre que possivel tailwindcss.
  - O componente deve ter um arquivo de estilos separado, APENAS quando necessário `component-name.styles.tsx `.

3. Stories do componente
  - Funções novas devem ser colocadas no stories, não alterar o que já existe ao menos que a funcionalidade tenha mudado.
  - Adicionar testes de interação com o componente em play function.

4. Componentes pequenos e focados
- O componente deve ser pequeno e focado em uma única responsabilidade.
- Quando precisar de um componente maior, criar vários componentes menores e reutilizaveis.
- Criar os componentes dentro da pasta `parts` dentro do da pasta do componente principal.
- Componentes filhos sempre deve ter o prefixo do pai no nome seguindo de dois traços. Exemplo "todo" o fiho deveria ser "todo--item".
- Componentes filhos devem seguir a MESMA estrutura do componente principal.
- O hook (controller), deverá ser pequeno e focado, caso seja necessário separe ele em vários hooks e coloque dentro da pasta logic

5. Documentação
- Não um arquivo de exemplo nem um README.md
- Documente o que cada props faz e para que ela existe em component-name.types.tsx
- Dentro dos hooks, sempre comente para que serve cada variavel e cada função de forma simples e pequena.