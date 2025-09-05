import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a página principal corretamente', async ({ page }) => {
    // Verifica se o título principal está presente
    await expect(page.locator('h1')).toContainText('shadcn/ui + Tailwind CSS v4');
    
    // Verifica se a descrição está presente
    await expect(page.locator('text=Configuração completa e funcionando perfeitamente!')).toBeVisible();
  });

  test('deve exibir todos os cards de funcionalidades', async ({ page }) => {
    // Verifica se os cards principais estão presentes usando seletores mais específicos
    await expect(page.locator('[data-slot="card-title"]:has-text("Componentes UI")')).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]:has-text("Tailwind CSS v4")')).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]:has-text("Next.js 15")')).toBeVisible();
  });

  test('deve exibir todas as variantes de botões', async ({ page }) => {
    // Verifica se os botões com diferentes variantes estão presentes usando first() para evitar strict mode
    await expect(page.locator('button:has-text("Padrão")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Secundário")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Outline")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Destrutivo")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Ghost")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Link")').first()).toBeVisible();
  });

  test('deve exibir botões de diferentes tamanhos', async ({ page }) => {
    // Verifica se os botões de diferentes tamanhos estão presentes
    await expect(page.locator('button:has-text("Pequeno")')).toBeVisible();
    await expect(page.locator('button:has-text("Grande")')).toBeVisible();
    await expect(page.locator('button:has-text("🚀")')).toBeVisible();
  });

  test('deve exibir o formulário de exemplo', async ({ page }) => {
    // Verifica se os campos do formulário estão presentes
    await expect(page.locator('input[placeholder="Digite seu nome"]')).toBeVisible();
    await expect(page.locator('input[placeholder="seu@email.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Sua mensagem aqui..."]')).toBeVisible();
    await expect(page.locator('button:has-text("Enviar Mensagem")')).toBeVisible();
  });

  test('deve permitir interação com o formulário', async ({ page }) => {
    // Testa a interação com os campos do formulário
    await page.fill('input[placeholder="Digite seu nome"]', 'João Silva');
    await page.fill('input[placeholder="seu@email.com"]', 'joao@exemplo.com');
    await page.fill('input[placeholder="Sua mensagem aqui..."]', 'Esta é uma mensagem de teste');

    // Verifica se os valores foram preenchidos
    await expect(page.locator('input[placeholder="Digite seu nome"]')).toHaveValue('João Silva');
    await expect(page.locator('input[placeholder="seu@email.com"]')).toHaveValue('joao@exemplo.com');
    await expect(page.locator('input[placeholder="Sua mensagem aqui..."]')).toHaveValue('Esta é uma mensagem de teste');
  });

  test('deve exibir as cores de teste do Tailwind', async ({ page }) => {
    // Verifica se as cores de teste estão presentes
    await expect(page.locator('text=Red 500')).toBeVisible();
    await expect(page.locator('text=Blue 500')).toBeVisible();
    await expect(page.locator('text=Green 500')).toBeVisible();
    await expect(page.locator('text=Purple 500')).toBeVisible();
  });

  test('deve exibir as instruções de uso do shadcn', async ({ page }) => {
    // Verifica se as instruções estão presentes
    await expect(page.locator('text=Para adicionar mais componentes, use:')).toBeVisible();
    await expect(page.locator('code:has-text("npx shadcn@latest add [component-name]")')).toBeVisible();
  });

  test('deve ter responsividade básica', async ({ page }) => {
    // Testa em viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]:has-text("Componentes UI")')).toBeVisible();

    // Testa em viewport desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]:has-text("Componentes UI")')).toBeVisible();
  });
}); 