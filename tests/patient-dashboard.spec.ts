import { test, expect } from '@playwright/test';

test('Patient Dashboard loads upcoming appointments and prescriptions', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Get Started' }).click();
  await page.getByText("I'm patient").click();
  await page.getByRole('textbox', { name: '* Phone' }).fill('251962212818');
  await page.getByRole('textbox', { name: '* Password' }).fill('12345678@Mm');
  await page.getByRole('button', { name: 'Login' }).click();

  const blogsResponse = await page.waitForResponse((res) =>
   res.url().includes('/blogs') && res.request().method() === 'GET'
 );

 const upcomingAppointmentsResponse = await page.waitForResponse((res) =>
   res.url().includes('/visits') &&
   res.url().includes('status=Scheduled') &&
   res.url().includes('approval=Approved') &&
   res.request().method() === 'GET'
 );

  const doctorsResponse = await page.waitForResponse((res) =>
   res.url().includes('/doctors') &&
   res.request().method() === 'GET'
 );


  const doctorsJson = await doctorsResponse.json();
  const doctors = doctorsJson.data?.doctors || [];

  // ✅ Check each doctor has a name and specializations
  for (const doctor of doctors) {
    const firstName = `${doctor.firstname}`;
    await expect(page.locator('body')).toContainText(firstName);

    for (const spec of doctor.specializations) {
      await expect(page.locator('body')).toContainText(spec);
    }

  }

  const blogsJson = await blogsResponse.json();
  const blogs = blogsJson.data?.blogs || [];

  // ✅ Check each blog has a title, author, and content snippet
  for (const blog of blogs) {
    await expect(page.locator('body')).toContainText(blog.title);
    await expect(page.locator('body')).toContainText(`${blog.author.firstname} ${blog.author.lastname}`);
    await expect(page.locator('body')).toContainText(blog.content.slice(0, 20));
  }

  const json = await upcomingAppointmentsResponse.json();
  const visits = json.data?.visits || [];

  // ✅ Check each visit has a doctor
  for (const visit of visits) {
    expect(visit.doctor, `Missing doctorId in visit ${visit.id || 'unknown ID'}`).toBeTruthy();
  }

  // ✅ Check prescriptions
  for (const visit of visits) {
    for (const p of visit.prescription || []) {
      await expect(page.locator('body')).toContainText(`${p.medication}(${p.dosage})`);
      if (p.instructions.includes('Duration:')) {
        const summaryLine = p.instructions.split('\n').find((line: string | string[]) => line.includes('Duration:'));
        if (summaryLine) {
          await expect(page.locator('body')).toContainText(summaryLine.trim());
        }
      }
    }
  }
});
