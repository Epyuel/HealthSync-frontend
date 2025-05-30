// auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.resolve('playwright/.auth/user.json');

setup('Login and save auth state', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Get Started' }).click();

  await page.getByText("I'm patient").click();
  await page.getByRole('textbox', { name: '* Phone' }).fill('251962212818');
  await page.getByRole('textbox', { name: '* Password' }).fill('12345678@Mm');
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for confirmation that login was successful
  await expect(page.locator('body')).toContainText('Login successful', { timeout: 40000 });

  // Save authenticated browser state
  await page.context().storageState({ path: authFile });
});
