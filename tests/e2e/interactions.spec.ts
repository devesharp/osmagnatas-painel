import { test, expect } from '@playwright/test';

test.describe('Interações Avançadas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve testar hover nos botões', async ({ page }) => {
    const button = page.locator('button:has-text("Padrão")').first();
    
    // Verifica se o botão está visível
    await expect(button).toBeVisible();
    
    // Faz hover no botão
    await button.hover();
    
    // Verifica se o botão ainda está visível após o hover
    await expect(button).toBeVisible();
  });

  test('deve testar cliques nos botões', async ({ page }) => {
    // Testa clique em diferentes variantes de botões usando first() para evitar strict mode
    const buttons = [
      'button:has-text("Padrão")',
      'button:has-text("Secundário")',
      'button:has-text("Outline")',
      'button:has-text("Destrutivo")',
      'button:has-text("Ghost")',
      'button:has-text("Link")'
    ];

    for (const buttonSelector of buttons) {
      const button = page.locator(buttonSelector).first();
      await expect(button).toBeVisible();
      await button.click();
      // Aguarda um pouco para simular interação real
      await page.waitForTimeout(100);
    }
  });

  test('deve testar navegação por teclado', async ({ page }) => {
    // Foca no primeiro input
    await page.locator('input[placeholder="Digite seu nome"]').focus();
    
    // Navega pelos campos usando Tab
    await page.keyboard.press('Tab');
    await expect(page.locator('input[placeholder="seu@email.com"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[placeholder="Sua mensagem aqui..."]')).toBeFocused();
  });

  test('deve testar preenchimento de formulário com dados inválidos', async ({ page }) => {
    // Testa email inválido
    await page.fill('input[placeholder="seu@email.com"]', 'email-invalido');
    
    // Verifica se o valor foi preenchido
    await expect(page.locator('input[placeholder="seu@email.com"]')).toHaveValue('email-invalido');
    
    // Limpa o campo
    await page.fill('input[placeholder="seu@email.com"]', '');
    await expect(page.locator('input[placeholder="seu@email.com"]')).toHaveValue('');
  });

  test('deve testar scroll da página', async ({ page }) => {
    // Verifica se está no topo da página
    await expect(page.locator('h1')).toBeInViewport();
    
    // Faz scroll para baixo
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Verifica se o footer está visível
    await expect(page.locator('text=Para adicionar mais componentes, use:')).toBeInViewport();
    
    // Volta para o topo
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('h1')).toBeInViewport();
  });

  test('deve testar captura de screenshot', async ({ page }) => {
    // Captura screenshot da página completa
    await page.screenshot({ path: 'tests/e2e/screenshots/homepage-full.png', fullPage: true });
    
    // Captura screenshot de um elemento específico
    await page.locator('h1').screenshot({ path: 'tests/e2e/screenshots/title.png' });
  });

  test('deve testar diferentes viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Verifica se elementos principais estão visíveis usando seletores mais específicos
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-slot="card-title"]:has-text("Componentes UI")')).toBeVisible();
      
      // Captura screenshot para cada viewport
      await page.screenshot({ 
        path: `tests/e2e/screenshots/homepage-${viewport.name}.png`,
        fullPage: true 
      });
    }
  });

  test('deve testar performance básica', async ({ page }) => {
    // Mede o tempo de carregamento
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Verifica se a página carregou em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Tempo de carregamento: ${loadTime}ms`);
  });

  test('deve testar acessibilidade básica', async ({ page }) => {
    // Verifica se há elementos com texto alternativo apropriado
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    // Verifica se todos os botões têm texto ou aria-label
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });
}); 