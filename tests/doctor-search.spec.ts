import { DoctorModel } from '@/components/models/doctor';
import { test, expect } from '@playwright/test';


test('filtering-results', async ({ page,context, request }) => {
    const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";
    await page.goto('http://localhost:3000/');

    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name === "token");
    if (!authCookie) {
        throw new Error("Auth cookie not found!");
    }

    const cookieHeader = `${authCookie.name}=${authCookie.value}`;

    const payload = await request.get(`${baseApiUrl}/doctors?status=approved`, {
        headers: {
            Cookie: cookieHeader,
        },
    });

    expect(payload.ok()).toBeTruthy();

    const {data} = await payload.json();
    const verifiedDoctors:DoctorModel[] = data.doctors;

    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'detached' });

    const list = page.getByTestId('doc-search-result-list');
    const items = list.locator('li');
    
    const count = await items.count();

    if(count!=0){

        const searchKey = 'dan';
        await page.getByRole('textbox', { name: 'Search' }).click();
        await page.getByRole('textbox', { name: 'Search' }).fill(searchKey);
        const firstName = await page.getByTestId('doc-search-result-name').textContent();
        expect(firstName?.trim()).toContain(searchKey);

        const filteredResults = verifiedDoctors?.filter((doctor) =>
            `Dr. ${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchKey.toLowerCase())
        ) ?? [];

        await page.getByTestId(filteredResults.at(0)?._id??'').click();
        await page.goto(`http://localhost:3000/patient/search?key=${filteredResults.at(0)?._id}`);

        await expect(page.locator('body')).toContainText('Full Name');
    }
})

test('request-visit',async ({page})=>{
    const doctor_id = '67eb15297db753f356e1173e'
    await page.goto(`http://localhost:3000/patient/search?key=${doctor_id}`);

    await page.getByRole('button', { name: 'Request Visit' }).click();
    await page.getByRole('textbox', { name: '* Preferred Date :' }).click();
    await page.getByText('30', { exact: true }).click();
    await page.getByRole('textbox', { name: '* Symptom :' }).click();
    await page.getByRole('textbox', { name: '* Symptom :' }).fill('Headache, vomit and nausea');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('body')).toContainText('Visit requested');
})