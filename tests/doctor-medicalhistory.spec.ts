import { test, expect } from "@playwright/test";

test("Doctor can view medical history detail", async ({ page, request, context }) => {
  const phone = "dani@gmail.com"; 
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";

  // Step 1: Login through UI
  await page.goto("http://localhost:3000/");
  await page.getByText("Get Started").click();
  await page.getByText("I'm doctor").click();
  await page.getByLabel("Phone").fill(phone);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/doctor/dashboard");

  // Step 2: Navigate to Medical History page
  await page.getByRole("link", { name: "Medical History" }).click();
  await page.waitForURL("**/doctor/medicalhistory");

  // Step 3: Verify page content
await page.getByText('Last Visit').click();
  await page.getByText('Medical History').nth(1).click();
  await page.getByText('Patient').click();
  await page.getByText('Diagnosis', { exact: true }).click();
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await page.getByText('Contact').click();
  await page.getByRole('cell', { name: 'Actions' }).click();
  await page.getByRole('textbox', { name: 'Search patients...' }).click();
  await page.getByRole('textbox', { name: 'Search patients...' }).fill('');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Oldest First' }).click();

  //   await expect(
  //     page.getByRole("heading", { name: "Medical History" })
  //   ).toBeVisible();

  // Step 4: Get auth cookies from browser context
  const cookies = await context.cookies();
  const authCookie = cookies.find((c) => c.name === "token");

  if (!authCookie) {
    throw new Error("Auth cookie not found!");
  }
  const cookieHeader = `${authCookie.name}=${authCookie.value}`;

  // Step 5: Fetch doctor's data to get ID
  const doctorInfoResponse = await request.get(`${baseApiUrl}/doctors/me`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  expect(doctorInfoResponse.ok()).toBeTruthy();
  const doctorInfoPayload = await doctorInfoResponse.json();

  let doctorId;
  if (doctorInfoPayload.data && doctorInfoPayload.data._id) {
    doctorId = doctorInfoPayload.data._id;
  } else if (doctorInfoPayload._id) {
    doctorId = doctorInfoPayload._id;
  }

  if (!doctorId) {
    console.error(
      "Raw /doctors/me response:",
      JSON.stringify(doctorInfoPayload, null, 2)
    );
    throw new Error(
      "Doctor ID not found from /doctors/me response. Check console for raw response."
    );
  }

  // Step 6: Fetch completed visits for the doctor
  const visitsResponse = await request.get(
    `${baseApiUrl}/visits?doctor_id=${doctorId}&status=Completed`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );
  expect(visitsResponse.ok()).toBeTruthy();
  const visitsPayload = await visitsResponse.json();
  const completedVisits = visitsPayload.data?.visits;

  if (!completedVisits || completedVisits.length === 0) {
    // If no completed visits, check for "No medical history found" message
    await expect(page.getByText("No medical history found.")).toBeVisible();
    console.log(
      "No completed visits found for the doctor. Test will check for empty state message."
    );
    return; // End test if no visits to check
  }

  // Step 7: Verify that at least one medical history entry is displayed
  const firstVisit = completedVisits[0];

  const historyEntriesLocator = page.locator("div.p-0 table tr:has(td)"); // Targets rows with data cells within the CardContent (p-0)

  await expect(historyEntriesLocator.first()).toBeVisible();


  console.log(
    `Found ${await historyEntriesLocator.count()} medical history entries on the page.`
  );
  expect(await historyEntriesLocator.count()).toBeGreaterThan(0);

  // Step 8: Test the "View Details" modal for the first entry
  // Assuming there's a button/link with text "View" or "Details" to open the modal
  const viewDetailsButton = historyEntriesLocator
    .first()
    .getByRole("button", { name: "View Details" });
  await expect(viewDetailsButton).toBeVisible();
  await viewDetailsButton.click();

  const viewVisitModal = page.getByRole("dialog", { name: "View Visit" });
  await expect(viewVisitModal).toBeVisible();

  await expect(viewVisitModal.getByText("Patient Name")).toBeVisible();
  await expect(viewVisitModal.getByText("Visited Doctor")).toBeVisible();
  await expect(viewVisitModal.getByText("Preferred Date")).toBeVisible();
  await expect(viewVisitModal.getByText("Reason")).toBeVisible();
  await expect(viewVisitModal.getByText("Status")).toBeVisible();
  await expect(viewVisitModal.getByText("Approval")).toBeVisible();

  // Close the modal (assuming a close button or clicking outside)

  const closeModalButton = viewVisitModal
    .getByRole("button", { name: /close/i })
    .or(viewVisitModal.getByLabel("Close"));
  if ((await closeModalButton.count()) > 0) {
    await closeModalButton.first().click();
    await expect(viewVisitModal).not.toBeVisible();
  } else {
    console.warn(
      "Could not find a close button for the ViewVisit modal. Skipping modal close verification."
    );
    await page.keyboard.press("Escape");
    await expect(viewVisitModal).not.toBeVisible({ timeout: 2000 }); 
  }

});
