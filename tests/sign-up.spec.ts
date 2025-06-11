import { test, expect } from '@playwright/test';

test('patient-signup', async ({ page }) => {
  test.setTimeout(300000)
  // await page.goto('https://health-sync-ivory.vercel.app/');
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Get Started' }).click();
  await page.locator('div').filter({ hasText: /^Signup$/ }).click();

  // First step
  await page.getByRole('textbox', { name: '* First Name' }).click();
  await page.getByRole('textbox', { name: '* First Name' }).fill('patient-test-01');
  await page.getByRole('textbox', { name: '* Last Name' }).click();
  await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  await page.getByRole('textbox', { name: '* Email' }).click();
  await page.getByRole('textbox', { name: '* Email' }).fill('eyueldemrew938@gmail.com');
  await page.getByRole('textbox', { name: '* Phone' }).click();
  await page.getByRole('textbox', { name: '* Phone' }).fill('251111111117');
  await page.getByRole('combobox', { name: '* Gender' }).click();
  await page.getByText('Male', { exact: true }).click();
  // await page.getByRole('combobox', { name: '* Age' }).click();
  // await page.locator('div.ant-select-item-option-content', { hasText: '42' }).click();
  ///////
  
  await page.getByRole('spinbutton', { name: '* Age' }).click();
  await page.getByRole('spinbutton', { name: '* Age' }).fill('40');
  ///////
  await page.getByRole('combobox', { name: '* Nationality' }).click();
  await page.getByRole('combobox', { name: '* Nationality' }).fill('eth');
  await page.getByTitle('Ethiopia').locator('div').click();

  await page.getByRole('button', { name: 'Continue' }).click();

  //Second step
  await page.getByRole('spinbutton', { name: '* Height (cm)' }).click();
  await page.getByRole('spinbutton', { name: '* Height (cm)' }).fill('170');

   await page.getByRole('spinbutton', { name: '* Weight (kg)' }).click();
  await page.getByRole('spinbutton', { name: '* Weight (kg)' }).fill('80');

  await page.getByRole('combobox', { name: '* Blood Type' }).click();
  await page.getByTitle('A+').locator('div').click();

  // Third step
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select an Allergy' }).click();
  await page.getByRole('option', { name: 'Fish (ዓሳ)' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select a Condition' }).click();
  await page.getByLabel('Thyroid Disease (የታይሮይድ በሽታ)').getByText('Thyroid Disease (የታይሮይድ በሽታ)').click();
  await page.getByRole('combobox').filter({ hasText: 'Select a Past Treatment' }).click();
  await page.getByRole('option', { name: 'Steroid Treatment (ስቴሮይድ ሕክምና)' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select a Major Accident' }).click();
  await page.getByLabel('Sports Injury (የስፖርት ጉዳት)').getByText('Sports Injury (የስፖርት ጉዳት)').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('12345678@Mm');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.locator('body')).toContainText('Registration successful!');

  // verification modal
  // await expect(page.getByLabel('Verify your account')).toContainText('Verify your account');
  // await page.getByRole('textbox', { name: 'Enter OTP' }).click();
  // await page.getByRole('textbox', { name: 'Enter OTP' }).fill('672117');
  // await page.getByRole('button', { name: 'Verify' }).click();
  // await expect(page.locator('body')).toContainText('Verification successful!');

  
});

test('doctor-signup', async ({ page }) => {
  await page.goto('https://health-sync-ivory.vercel.app/');
  await page.getByRole('button', { name: 'Get Started' }).click();
  await page.locator('div').filter({ hasText: /^Signup$/ }).click();
  await page.locator('div').filter({ hasText: /^I am a doctor$/ }).click();

  // First step
  await page.getByRole('textbox', { name: '* First Name' }).click();
  await page.getByRole('textbox', { name: '* First Name' }).fill('doctor-test-01');
  await page.getByRole('textbox', { name: '* Last Name' }).click();
  await page.getByRole('textbox', { name: '* Last Name' }).fill('test');
  await page.getByRole('textbox', { name: '* Email' }).click();
  await page.getByRole('textbox', { name: '* Email' }).fill('roynn@gmail.com');
  await page.getByText('Male').click();
  await page.getByText('Female', { exact: true }).click();
  await page.getByRole('spinbutton', { name: '* Age' }).click();
  await page.getByRole('spinbutton', { name: '* Age' }).fill('30');
  await page.getByRole('textbox', { name: '* Phone Number' }).click();
  await page.getByRole('textbox', { name: '* Phone Number' }).fill('251111111128');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Second step
  
  await page.locator('div').filter({ hasText: /^Select a hospital$/ }).nth(1).click();
  await page.getByText('Bethel General Hospital').click();


  await page.locator('.ant-form-item-control-input-content > .ant-select > .ant-select-selector').first().click();
  await page.getByTitle('Orthopedics').locator('div').click();
  

  await page.locator('div:nth-child(4) > .ant-form-item > .ant-row > div:nth-child(2) > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-selector > .ant-select-selection-wrap > .ant-select-selection-overflow').click();
  await page.getByTitle('MS').click();
  
  await page.locator('input[type="file"]').setInputFiles('public/images/bg.jpeg');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('12345678@Mm');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.locator('body')).toContainText('Registration successful!');

  // Verification modal
  // await page.getByRole('textbox', { name: 'Enter OTP' }).click();
  // await page.getByRole('textbox', { name: 'Enter OTP' }).fill('736360');
  // await page.getByRole('button', { name: 'Verify' }).click();
  // await expect(page.locator('body')).toContainText('Verification successful!');
});