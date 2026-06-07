import { test, expect } from '@playwright/test';

test.describe('Tema claro/escuro', () => {
  test('alterna do claro para o escuro pela navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Westminster/i })).toBeVisible();

    const toggle = page.getByRole('button', { name: /Ativar modo (escuro|claro)/i });
    await expect(toggle).toBeVisible();

    const htmlBefore = await page.locator('html').getAttribute('class');
    await toggle.click();
    await expect.poll(async () => page.locator('html').getAttribute('class')).not.toBe(htmlBefore);
  });

  test('a preferência persiste após reload', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Ativar modo (escuro|claro)/i });
    await toggle.click();
    const after = await page.locator('html').getAttribute('class');
    await page.reload();
    await expect.poll(async () => page.locator('html').getAttribute('class')).toBe(after);
  });
});
