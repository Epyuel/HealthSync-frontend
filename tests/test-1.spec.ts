import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('h2')).toContainText('HealthSync');
  await page.getByRole('button', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('About Us');
  await page.getByRole('button', { name: 'Contact' }).click();
  await expect(page.getByRole('main')).toContainText('Contact Us');
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'Get Started' }).click();

  await expect(page.locator('form')).toContainText('I\'m patient');
  await expect(page.locator('form')).toContainText('I\'m doctor');
  
 
  // Doctor

  // unsuccessful login


  // successful login
  await page.getByText('I\'m doctor').click();
  await page.getByRole('textbox', { name: '* Phone' }).click();
  await page.getByRole('textbox', { name: '* Phone' }).fill('251987654321');
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('12345678@Mm');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.goto('http://localhost:3000/doctor/dashboard');
  await expect(page.locator('body')).toContainText('Login successful.');

  
  
});

test('unsuccessful-login', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#phone_help')).toContainText('Phone number or Email is required');
  await expect(page.locator('#password_help')).toContainText('Password is required');


  await page.getByRole('textbox', { name: '* Phone' }).click();
  await page.getByRole('textbox', { name: '* Phone' }).fill('4565776');
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('hgdvsjdbk');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('body')).toContainText('Incorrect credential');



  //test

  await page.getByRole('heading', { name: 'Dr. melakeselam yitbarek' }).click();
  
await expect(page.locator('body')).toContainText('Dr. melakeselam yitbarek');
})
