import { test as setup, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const authFile = path.join(__dirname, '.auth/user.json');

setup('autentica e salva storageState', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const res = await page.request.post('/api/auth/login', {
    data: { email: 'tester@catechumenon.dev', password: 'tester1234' },
  });
  expect(res.ok()).toBeTruthy();

  await page.context().storageState({ path: authFile });
});
