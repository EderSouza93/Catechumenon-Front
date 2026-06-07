import { test, expect } from '@playwright/test';

test.describe('Busca global (autenticado)', () => {
  test('clicando no botão Abrir busca abre o modal e mostra resultados', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /Olá/i })).toBeVisible();

    await page.getByRole('button', { name: /abrir busca/i }).click();

    const searchInput = page.getByPlaceholder(/buscar em todos/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('graça');
    await expect(page.getByText(/Confissão 7\.2/i)).toBeVisible({ timeout: 5_000 });
  });

  test('clicar em resultado navega para o documento alvo', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /abrir busca/i }).click();
    const searchInput = page.getByPlaceholder(/buscar em todos/i);
    await searchInput.fill('graça');
    await page.getByText(/Confissão 7\.2/i).click();
    await expect(page).toHaveURL(/\/confissao/);
  });
});
