import { test, expect } from '@playwright/test';

test.describe('Cadastro e login', () => {
  test('cadastra novo usuário e redireciona para o dashboard', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible();

    await page.getByLabel('Nome').fill('Novo Usuário');
    await page.getByLabel('E-mail').fill('novo@catechumenon.dev');
    await page.getByLabel('Senha', { exact: true }).fill('senha123');
    await page.getByLabel('Confirmar senha').fill('senha123');
    await page.getByRole('button', { name: /criar conta/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Olá/i })).toBeVisible();
  });

  test('faz login com credenciais válidas', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('tester@catechumenon.dev');
    await page.locator('#password').fill('tester1234');
    await page.getByRole('button', { name: /^Entrar$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('mostra mensagem de erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('wrong@catechumenon.dev');
    await page.locator('#password').fill('any');
    await page.getByRole('button', { name: /^Entrar$/i }).click();

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('middleware redireciona rota protegida para /login', async ({ browser }) => {
    const ctx = await browser.newContext();
    const fresh = await ctx.newPage();
    await fresh.goto('/dashboard');
    await expect(fresh).toHaveURL(/\/login\?callbackUrl=%2Fdashboard/);
    await ctx.close();
  });
});
