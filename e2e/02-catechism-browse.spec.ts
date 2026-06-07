import { test, expect } from '@playwright/test';

test.describe('Navegação no Catecismo Menor (autenticado)', () => {
  test('lista perguntas paginadas e exibe o título principal', async ({ page }) => {
    await page.goto('/catecismo-menor');
    await expect(page.getByText(/Qual o fim principal do homem/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('Catecismo Maior carrega corretamente', async ({ page }) => {
    await page.goto('/catecismo-maior');
    await expect(
      page.getByText(/Qual é o principal e mais elevado fim do homem/i),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('Confissão de Fé carrega o capítulo Das Sagradas Escrituras', async ({ page }) => {
    await page.goto('/confissao');
    await expect(page.getByText(/Das Sagradas Escrituras/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
