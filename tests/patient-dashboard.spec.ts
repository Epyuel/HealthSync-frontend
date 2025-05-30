import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Ensure the user is logged in as a patient before each test
  await page.goto('http://localhost:3000/patient/dashboard');
});
  
test('Patient Dashboard page loads', async ({ page }) => {
  
  await expect(page).toHaveURL(/\/patient\/dashboard/);
});

test('Fetch upcoming approved scheduled visits', async ({ page }) => {
  

  const response = await page.waitForResponse((res) =>
    res.url().includes('/visits') &&
    res.url().includes('status=Scheduled') &&
    res.url().includes('approval=Approved') &&
    res.request().method() === 'GET'
  );

  const json = await response.json();
  const visits = json.data?.visits || [];

  for (const visit of visits) {
    expect(visit.doctor, `Missing doctor in visit ${visit.id || 'unknown ID'}`).toBeTruthy();
  }
});

test('Blogs render with title, author, and content snippet', async ({ page }) => {
  

  const response = await page.waitForResponse((res) =>
    res.url().includes('/blogs') && res.request().method() === 'GET'
  );

  const blogs = (await response.json()).data?.blogs || [];

  for (const blog of blogs) {
    await expect(page.locator('body')).toContainText(blog.title);
    await expect(page.locator('body')).toContainText(`${blog.author.firstname} ${blog.author.lastname}`);
    await expect(page.locator('body')).toContainText(blog.content.slice(0, 20));
  }
});

test('Doctors list renders with name and specialization', async ({ page }) => {
  

  const response = await page.waitForResponse((res) =>
    res.url().includes('/doctors') && res.request().method() === 'GET'
  );

  const doctors = (await response.json()).data?.doctors || [];

  for (const doctor of doctors) {
    await expect(page.locator('body')).toContainText(doctor.firstname);
    for (const spec of doctor.specializations) {
      await expect(page.locator('body')).toContainText(spec);
    }
  }
});

test('Prescriptions render with medication and duration', async ({ page }) => {
  

  const response = await page.waitForResponse((res) =>
    res.url().includes('/visits') &&
    res.url().includes('status=Scheduled') &&
    res.url().includes('approval=Approved') &&
    res.request().method() === 'GET'
  );

  const visits = (await response.json()).data?.visits || [];

  for (const visit of visits) {
    for (const p of visit.prescription || []) {
      await expect(page.locator('body')).toContainText(`${p.medication}(${p.dosage})`);

      if (p.instructions.includes('Duration:')) {
        const durationLine = p.instructions.split('\n').find((line: string | string[]) => line.includes('Duration:'));
        if (durationLine) {
          await expect(page.locator('body')).toContainText(durationLine.trim());
        }
      }
    }
  }
});
