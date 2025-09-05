# Testes E2E com Playwright

Este diretório contém os testes end-to-end (E2E) da aplicação usando o Playwright.

## Estrutura

```
tests/
├── e2e/
│   ├── homepage.spec.ts      # Testes da página principal
│   ├── interactions.spec.ts  # Testes de interações avançadas
│   └── screenshots/          # Screenshots capturados durante os testes
└── README.md                 # Este arquivo
```

## Scripts Disponíveis

### Executar todos os testes
```bash
npm run test:e2e
```

### Executar testes com interface visual
```bash
npm run test:e2e:ui
```

### Executar testes com browser visível
```bash
npm run test:e2e:headed
```

### Executar testes em modo debug
```bash
npm run test:e2e:debug
```

## Testes Implementados

### Homepage (`homepage.spec.ts`)
- ✅ Carregamento da página principal
- ✅ Exibição de cards de funcionalidades
- ✅ Variantes de botões
- ✅ Tamanhos de botões
- ✅ Formulário de exemplo
- ✅ Interação com formulário
- ✅ Cores de teste do Tailwind
- ✅ Instruções do shadcn
- ✅ Responsividade básica

### Interações Avançadas (`interactions.spec.ts`)
- ✅ Hover nos botões
- ✅ Cliques em botões
- ✅ Navegação por teclado
- ✅ Validação de formulário
- ✅ Scroll da página
- ✅ Captura de screenshots
- ✅ Testes em diferentes viewports
- ✅ Performance básica
- ✅ Acessibilidade básica

## Configuração

O Playwright está configurado para:
- Executar testes em Chromium, Firefox e WebKit
- Iniciar automaticamente o servidor de desenvolvimento
- Capturar traces em caso de falha
- Gerar relatórios HTML

## Browsers Suportados

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

## Screenshots

Os testes capturam screenshots automaticamente em:
- `tests/e2e/screenshots/homepage-full.png` - Página completa
- `tests/e2e/screenshots/title.png` - Título da página
- `tests/e2e/screenshots/homepage-{viewport}.png` - Diferentes viewports

## Relatórios

Após executar os testes, um relatório HTML é gerado em:
```
playwright-report/index.html
```

Para visualizar o relatório:
```bash
npx playwright show-report
```

## Dicas

1. **Desenvolvimento**: Use `npm run test:e2e:ui` para uma experiência visual
2. **Debug**: Use `npm run test:e2e:debug` para pausar e inspecionar
3. **CI/CD**: Use `npm run test:e2e` para execução automatizada
4. **Performance**: Os testes incluem verificações básicas de tempo de carregamento

## Próximos Passos

- [ ] Adicionar testes de autenticação
- [ ] Implementar testes de API
- [ ] Adicionar testes de acessibilidade com axe-core
- [ ] Configurar testes visuais (visual regression)
- [ ] Integrar com CI/CD pipeline 