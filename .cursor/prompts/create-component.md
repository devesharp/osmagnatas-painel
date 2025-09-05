# Create component

## Estrutura do componente

O componente pode ter a seguinte estrutura:

Use o comando `yarn plop component {component-name}` para criar o componente na pasta `src/components` que é o padrão
  - MAS CASO SEJA ESPECIFICADO o diretorio (Ex: 'src/app/page') use o comando `yarn plop component {component-name} --dir="src/app/page"`

Serão criados os arquivos dentro da pasta `component-name`:
```
./component-name.types.tsx // (obrigatório) Tipos do componente
./component-name.ctrl.tsx // (opcional) Controlador contendo toda a lógica do componente
./component-name.tsx // (obrigatório) Componente
./component-name.styles.tsx // (opcional) Estilos do componente
./component-name.stories.tsx // (obrigatório) Stories do componente
./index.tsx // (obrigatório) Exportação do componente e da interface do componente
```

## Componente

1. Lógica do componente
  - O componente deve ser um componente funcional e sempre exportado como função e não arrow function.
  - Caso o componente possua conteudo que não seja apenas renderização, deverá colocar tudo dentro de `component-name.ctrl.tsx` e exportar como `const ctrl = componentNameCtrl(props)`.

2. Estilos do componente
- Usar sempre que possivel tailwindcss.
- O componente deve ter um arquivo de estilos separado, APENAS quando necessário.

3. Stories do componente
- Criar stories para o componente com storybook
- Adicionar o máximo de variaveis possiveis para o componente.
- Adicionar testes de interação com o componente em play function.

4. Componentes pequenos e focados
- O componente deve ser pequeno e focado em uma única responsabilidade.
- Quando precisar de um componente maior, criar vários componentes menores e reutilizaveis.
- Criar os componentes dentro da pasta `parts` dentro do da pasta do componente principal.
- Componentes filhos sempre deve ter o prefixo do pai no nome seguindo de dois traços. Exemplo "todo" o fiho deveria ser "todo--item".
- Componentes filhos devem seguir a MESMA estrutura do componente principal.

5. Documentação
- Não um arquivo de exemplo nem um README.md
- Documente o que cada props faz e para que ela existe em component-name.types.tsx
- Dentro dos hooks, sempre comente para que serve cada variavel e cada função de forma simples e pequena.