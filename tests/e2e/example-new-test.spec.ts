import { test, expect } from '@playwright/test';

// Este é um arquivo de exemplo para demonstrar como criar novos testes
// Você pode usar este template como base para seus próprios testes

test.describe('Exemplo de Novo Teste', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a página antes de cada teste
    await page.goto('/');
  });

  test('exemplo básico de verificação de elemento', async ({ page }) => {
    // Verifica se um elemento específico está presente
    await expect(page.locator('h1')).toBeVisible();
    
    // Verifica o texto do elemento
    await expect(page.locator('h1')).toContainText('shadcn/ui');
  });

  test('exemplo de interação com formulário', async ({ page }) => {
    // Preenche um campo de input
    await page.fill('input[placeholder="Digite seu nome"]', 'Teste Playwright');
    
    // Verifica se o valor foi preenchido
    await expect(page.locator('input[placeholder="Digite seu nome"]')).toHaveValue('Teste Playwright');
    
    // Clica em um botão
    await page.click('button:has-text("Enviar Mensagem")');
  });

  test('exemplo de teste de responsividade', async ({ page }) => {
    // Define viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verifica se elementos estão visíveis em mobile
    await expect(page.locator('h1')).toBeVisible();
    
    // Muda para desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Verifica se elementos estão visíveis em desktop
    await expect(page.locator('h1')).toBeVisible();
  });

  test('exemplo de captura de screenshot', async ({ page }) => {
    // Captura screenshot da página
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/exemplo-screenshot.png',
      fullPage: true 
    });
    
    // Captura screenshot de um elemento específico
    await page.locator('h1').screenshot({ 
      path: 'tests/e2e/screenshots/exemplo-elemento.png' 
    });
  });

  test('exemplo de teste de performance', async ({ page }) => {
    // Mede tempo de carregamento
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verifica se carregou em tempo aceitável
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Página carregou em: ${loadTime}ms`);
  });

  test('exemplo de teste com múltiplas ações', async ({ page }) => {
    // Sequência de ações mais complexa
    
    // 1. Verifica carregamento inicial
    await expect(page.locator('h1')).toBeVisible();
    
    // 2. Interage com formulário
    await page.fill('input[placeholder="Digite seu nome"]', 'João');
    await page.fill('input[placeholder="seu@email.com"]', 'joao@teste.com');
    
    // 3. Testa navegação por teclado
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // 4. Verifica estado final
    await expect(page.locator('input[placeholder="Digite seu nome"]')).toHaveValue('João');
    await expect(page.locator('input[placeholder="seu@email.com"]')).toHaveValue('joao@teste.com');
  });

  // Teste que será ignorado (útil durante desenvolvimento)
  test.skip('exemplo de teste ignorado', async ({ page }) => {
    // Este teste será ignorado durante a execução
    await page.goto('/');
  });

  // Teste que só roda em condições específicas
  test('exemplo de teste condicional', async ({ page, browserName }) => {
    // Só executa no Chrome
    test.skip(browserName !== 'chromium', 'Este teste só roda no Chrome');
    
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
}); 