import { test, expect } from '@playwright/test';

test.describe('Progresso de leitura (autenticado)', () => {
  test('marca pergunta como lida e dispara PATCH /api/progress', async ({ page }) => {
    const patchPromise = page.waitForResponse(
      (res) => res.url().endsWith('/api/progress') && res.request().method() === 'PATCH',
    );

    await page.goto('/catecismo-menor');
    await expect(page.getByText(/Qual o fim principal do homem/i)).toBeVisible({
      timeout: 15_000,
    });

    const markButton = page.getByRole('button', { name: /Marcar como lido/i }).first();
    await markButton.click();

    const response = await patchPromise;
    expect(response.status()).toBe(200);
    await expect(page.getByRole('button', { name: /Desmarcar como lido/i }).first()).toBeVisible();
  });

  test('progresso persiste entre navegações', async ({ page }) => {
    await page.goto('/catecismo-menor');
    await expect(page.getByText(/Qual o fim principal/i)).toBeVisible({ timeout: 15_000 });
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /Olá/i })).toBeVisible();
  });
});
