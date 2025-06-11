import { test, expect } from "@playwright/test";

test("Check if Doctor can view active visits", async ({ page, request, context }) => {
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

  // Step 2: Navigate to Active Visits page
  await page.getByRole("link", { name: "Active Visits" }).click();
  await page.waitForURL("**/doctor/activevisits");

  // Step 3: Verify page content
  await page.getByRole("heading", { name: "Active Visits" }).click();
  await page.getByRole("heading", { name: "Recently Ended" }).click();

  const cookies = await context.cookies();
  const authCookie = cookies.find((c) => c.name === "token");

  if (!authCookie) {
    throw new Error("Auth cookie not found!");
  }

  const cookieHeader = `${authCookie.name}=${authCookie.value}`;

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
      "Doctor ID not found"
    );
  }

  // Step 4: Fetch Scheduled (Active) Visits for the doctor
  const visitsResponse = await request.get(
    `${baseApiUrl}/visits?doctor_id=${doctorId}&approval=Scheduled`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );
  expect(visitsResponse.ok()).toBeTruthy();
  const visitsData = await visitsResponse.json();

  const activeVisits = visitsData?.data?.visits;

  // Step 5: Conditionally check UI based on fetched visits
  if (!activeVisits || activeVisits.length === 0) {
    await expect(page.getByText("No Data")).toBeVisible({ timeout: 10000 });
  } else {
    await page.waitForSelector(".embla__container", { timeout: 10000 });

    const visibleCompleteButtons = page.locator(
      'button:has-text("Complete Visit"):visible'
    );
    const count = await visibleCompleteButtons.count();

    if (count === 0) {
      // If API returns visits but no 'Complete Visit' buttons are visible, check for a 'No Data' or similar message
      await expect(page.getByText("No Data")).toBeVisible({
        timeout: 10000,
      });
    } else{

        await page.getByRole("button", { name: "Complete Visit" }).click();
        await page.getByRole("button", { name: "Cancel" }).click();
        await page.getByRole("button", { name: "Edit" }).click();
        await page
          .getByLabel("Edit Visit")
          .getByRole("button", { name: "Next" })
          .click();
        await page.getByRole("button", { name: "Back" }).click();
        await page.getByRole("button", { name: "Close", exact: true }).click();
    }
  }
});


test("Check if complete visit is working", async ({
  page,
  request,
  context,
}) => {
  const phone = "dani@gmail.com";
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";

  // Step 1: Login and Navigate
  await page.goto("http://localhost:3000/");
  await page.getByText("Get Started").click();
  await page.getByText("I'm doctor").click();
  await page.getByLabel("Phone").fill(phone);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/doctor/dashboard");

  // Step 2: Navigate to Active Visits page
  await page.getByRole("link", { name: "Active Visits" }).click();
  await page.waitForURL("**/doctor/activevisits");

  // Step 3: Fetch Doctor ID
  const cookies = await context.cookies();
  const authCookie = cookies.find((c) => c.name === "token");

  if (!authCookie) {
    throw new Error("Auth cookie not found!");
  }

  const cookieHeader = `${authCookie.name}=${authCookie.value}`;

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
      "Doctor ID not found"
    );
  }

  // Step 4: Fetch Scheduled (Active) Visits for the doctor
  const visitsResponse = await request.get(
    `${baseApiUrl}/visits?doctor_id=${doctorId}&approval=Scheduled`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );
  expect(visitsResponse.ok()).toBeTruthy();
  const visitsData = await visitsResponse.json();

  const activeVisits = visitsData?.data?.visits;

  // Step 5: Conditionally check UI based on fetched visits
  if (!activeVisits || activeVisits.length === 0) {
    await expect(page.getByText("No Data")).toBeVisible({ timeout: 10000 });
  } else {
    await page.waitForSelector(".embla__container", { timeout: 10000 });

    const visibleCompleteButtons = page.locator(
      'button:has-text("Complete Visit"):visible'
    );
    const count = await visibleCompleteButtons.count();

    if (count === 0) {
      // If API returns visits but no 'Complete Visit' buttons are visible, check for a 'No Data' or similar message
      await expect(page.getByText("No Data")).toBeVisible({
        timeout: 10000,
      });
    } else {
      // If 'Complete Visit' buttons are visible, proceed with interaction
      // First click - Cancel
      await visibleCompleteButtons.nth(0).click();
      await page.getByRole("button", { name: "Cancel" }).click();

      // Second click - Confirm
      await visibleCompleteButtons.nth(0).click();
      await page.getByRole("button", { name: "Yes" }).click();

      await expect(page.getByText("Visit Completed")).toBeVisible({
        timeout: 10000,
      });
    }
  }
});
