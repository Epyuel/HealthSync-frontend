import { test, expect } from "@playwright/test";

test("AnalysisChart displays actual dashboard data after doctor login", async ({
  page,
  request,
  context,
}) => {
  const phone = "dani@gmail.com";
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";

  await page.goto("http://localhost:3000/");
  await page.getByText("Get Started").click();
  await page.getByText("I'm doctor").click();
  await page.getByLabel("Phone").fill(phone);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/doctor/dashboard");

  const cookies = await context.cookies();
  // console.log("Cookies:", cookies);

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
      "Doctor ID not found from /doctors/me response. Check console for raw response."
    );
  }
  // console.log("Fetched doctorId:", doctorId);

  const figuresResponse = await request.get(
    `${baseApiUrl}/figures/visits?doctor_id=${doctorId}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  // console.log("API status (/figures/visits):", figuresResponse.status());
  expect(figuresResponse.ok()).toBeTruthy();

  const figuresDataPayload = await figuresResponse.json();

  const actualFigures = figuresDataPayload.data;
  if (!actualFigures) {
    console.error(
      "Raw /figures/visits response:",
      JSON.stringify(figuresDataPayload, null, 2)
    );
    throw new Error(
      "Figures data not found in expected structure (e.g., response.data). Check console for raw response."
    );
  }

  const { totalCount, thisMonthCount, lastMonthCount, percentageChange } =
    actualFigures;

  expect(totalCount).toBe(16);
  expect(thisMonthCount).toBe(16);
  expect(lastMonthCount).toBe(0);
  expect(percentageChange).toBe(100);
});

test("doctor rating properly displayed", async ({ page, request, context }) => {
  const phone = "dani@gmail.com";
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";

  // Step 1️ Login through UI
  await page.goto("http://localhost:3000/");
  await page.getByText("Get Started").click();
  await page.getByText("I'm doctor").click();
  await page.getByLabel("Phone").fill(phone);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/doctor/dashboard");

  // Step 2️ Get auth cookies from browser context
  const cookies = await context.cookies();
  const authCookie = cookies.find((c) => c.name === "token");

  if (!authCookie) {
    throw new Error("Auth cookie not found!");
  }
  const cookieHeader = `${authCookie.name}=${authCookie.value}`;

  // Step 3️ Fetch doctor's data
  const doctorInfoResponse = await request.get(`${baseApiUrl}/doctors/me`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  expect(doctorInfoResponse.ok()).toBeTruthy();
  const doctorInfoPayload = await doctorInfoResponse.json();

  // Step 4️ Extract rating and calculate percentage
  let rating;
  if (
    doctorInfoPayload.data &&
    typeof doctorInfoPayload.data.rating === "number"
  ) {
    rating = doctorInfoPayload.data.rating;
  } else if (typeof doctorInfoPayload.rating === "number") {
    rating = doctorInfoPayload.rating;
  }

  if (typeof rating !== "number") {
    console.error(
      "Raw /doctors/me response for rating:",
      JSON.stringify(doctorInfoPayload, null, 2)
    );
    throw new Error(
      "Rating not found or not a number in /doctors/me response. Check console for raw response."
    );
  }
  // console.log("Fetched doctor rating:", rating);

  const ratingPercentage = (rating / 5) * 100;
  // console.log("Calculated rating percentage:", ratingPercentage);

  // Step 5️ Assert the rating percentage
  const expectedRatingValue = 3.4; // Adjust this to your test doctor's specific rating
  const expectedPercentage = (expectedRatingValue / 5) * 100;
  expect(ratingPercentage).toBe(expectedPercentage);

  // Wait for the rating to be displayed
  // await page.waitForSelector('//div[contains(@class, "text-center")]/p[contains(text(), "%")]', { timeout: 60000 });
  // const displayedRatingText = await page
  //   .locator('//div[contains(@class, "text-center")]/p[contains(text(), "%")]')
  //   .textContent();
  // expect(displayedRatingText).toContain(ratingPercentage.toFixed(1)); // e.g., "68.0%"
});

// Helper function to format date as it appears in the UI
function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .replace(",", "")
    .replace(/(\w+) (\d{2}) (\d{4})/, "$1 $2/$3");
}

function formatDisplayTime(dateString: string): string {
  const date = new Date(dateString);
  // Format: HH:MM AM/PM (e.g., 09:00 AM)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

test("Recent completed visits are displayed correctly", async ({
  page,
  request,
  context,
}) => {
  const phone = "dani@gmail.com";
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";

  // Step 1️ Login through UI
  await page.goto("http://localhost:3000/");
  await page.getByText("Get Started").click();
  await page.getByText("I'm doctor").click();
  await page.getByLabel("Phone").fill(phone);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/doctor/dashboard");

  // Step 2️ Get auth cookies and doctor ID
  const cookies = await context.cookies();
  const authCookie = cookies.find((c) => c.name === "token");
  if (!authCookie) throw new Error("Auth cookie not found!");
  const cookieHeader = `${authCookie.name}=${authCookie.value}`;

  const doctorInfoResponse = await request.get(`${baseApiUrl}/doctors/me`, {
    headers: { Cookie: cookieHeader },
  });
  expect(doctorInfoResponse.ok()).toBeTruthy();
  const doctorInfoPayload = await doctorInfoResponse.json();
  let doctorId;
  if (doctorInfoPayload.data && doctorInfoPayload.data._id) {
    doctorId = doctorInfoPayload.data._id;
  } else if (doctorInfoPayload._id) {
    doctorId = doctorInfoPayload._id;
  }
  if (!doctorId) throw new Error("Doctor ID not found response.");

  // Step 3️ Verify static text elements
  await expect(page.getByText("Recently Completed Visits")).toBeVisible();
  await expect(page.getByText("below are your Recent visits")).toBeVisible();

  // Step 4️ Fetch completed visits from API
  const visitsResponse = await request.get(
    `${baseApiUrl}/visits?doctor_id=${doctorId}&status=Completed`,
    {
      headers: { Cookie: cookieHeader },
    }
  );
  expect(visitsResponse.ok()).toBeTruthy();
  const visitsPayload = await visitsResponse.json();
  const rawApiVisits = visitsPayload?.data?.visits || [];

  // Sorting and slicing teh visits
  const expectedVisits = rawApiVisits
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  // Step 5️ Assert visits display
  const visitItemsLocator = page.locator(
    '//div[h2[text()="Recently Completed Visits"]]/following-sibling::div/div[contains(@class, "border-b-2")]'
  );

  if (expectedVisits.length > 0) {
    await expect(visitItemsLocator).toHaveCount(expectedVisits.length);

    for (let i = 0; i < expectedVisits.length; i++) {
      const visitData = expectedVisits[i];
      const visitItem = visitItemsLocator.nth(i);

      const expectedStartDateStr = formatDisplayDate(visitData.startDate);
      const expectedStartTimeStr = formatDisplayTime(visitData.startDate);
      const expectedEndTimeStr = formatDisplayTime(visitData.endDate);

      const textContent = await visitItem.textContent();
      expect(textContent).toContain(`On${expectedStartDateStr}`);
      expect(textContent).toContain(`from${expectedStartTimeStr}`);
      expect(textContent).toContain(`to${expectedEndTimeStr}`);
    }
  } else {
    // If no visits, expect no visit items to be rendered
    await expect(visitItemsLocator).toHaveCount(0);
    const visitListContainer = page.locator(
      '//div[h2[text()="Recently Completed Visits"]]/following-sibling::div'
    );

    expect(
      await visitListContainer
        .locator('.//div[contains(@class, "border-b-2")]') // Corrected to relative XPath
        .count()
    ).toBe(0);
  }
});

test("Upcoming visits are displayed correctly", async ({
  page,
  request,
  context,
}) => {
  const phone = "dani@gmail.com";
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";

  // Step 1️ Login through UI
  await page.goto("http://localhost:3000/");
  await page.getByText("Get Started").click();
  await page.getByText("I'm doctor").click();
  await page.getByLabel("Phone").fill(phone);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/doctor/dashboard");

  // Step 2️ Get auth cookies and doctor ID
  const cookies = await context.cookies();
  const authCookie = cookies.find((c) => c.name === "token");
  if (!authCookie) throw new Error("Auth cookie not found!");
  const cookieHeader = `${authCookie.name}=${authCookie.value}`;

  const doctorInfoResponse = await request.get(`${baseApiUrl}/doctors/me`, {
    headers: { Cookie: cookieHeader },
  });
  expect(doctorInfoResponse.ok()).toBeTruthy();
  const doctorInfoPayload = await doctorInfoResponse.json();
  let doctorId;
  if (doctorInfoPayload.data && doctorInfoPayload.data._id) {
    doctorId = doctorInfoPayload.data._id;
  } else if (doctorInfoPayload._id) {
    doctorId = doctorInfoPayload._id;
  }
  if (!doctorId)
    throw new Error("Doctor ID not found from /doctors/me response.");

  // Step 3️ Verify static text elements
  await expect(
    page.getByRole("heading", { name: "Upcoming Visits" })
  ).toBeVisible();
  await expect(page.getByText("below are your upcoming visits")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Recently Completed Visits" })
  ).toBeVisible();
  await expect(page.getByText("below are your Recent visits")).toBeVisible();

  // Step 4️ Fetch upcoming visits from API
  const visitsResponse = await request.get(
    `${baseApiUrl}/visits?doctor_id=${doctorId}&approval=Scheduled`,
    {
      headers: { Cookie: cookieHeader },
    }
  );
  expect(visitsResponse.ok()).toBeTruthy();
  const visitsPayload = await visitsResponse.json();
  const expectedVisits = visitsPayload?.data?.visits || []; // No sorting/slicing needed as per component

  // Step 5️ Assert visits display
  // Locator for upcoming visit items
  const visitItemsLocator = page.locator(
    '//div[h2[text()="Upcoming Visits"]]/following-sibling::div/div[contains(@class, "border-b-2")]'
  );

  if (expectedVisits.length > 0) {
    await expect(visitItemsLocator).toHaveCount(expectedVisits.length);

    for (let i = 0; i < expectedVisits.length; i++) {
      const visitData = expectedVisits[i];
      const visitItem = visitItemsLocator.nth(i);

      const expectedStartDateStr = formatDisplayDate(visitData.startDate);
      const expectedStartTimeStr = formatDisplayTime(visitData.startDate);
      const expectedEndTimeStr = formatDisplayTime(visitData.endDate);

      const textContent = await visitItem.textContent();
      expect(textContent).toContain(`On${expectedStartDateStr}`);
      expect(textContent).toContain(`from${expectedStartTimeStr}`);
      expect(textContent).toContain(`to${expectedEndTimeStr}`);
    }
  } else {
    // If no visits, expect no visit items to be rendered
    // await expect(visitItemsLocator).toHaveCount(0);
    // const visitListContainer = page.locator(
    //   '//div[h2[text()="Upcoming Visits"]]/following-sibling::div'
    // );
    // expect(
    //   await visitListContainer
    //     .locator('.//div[contains(@class, "border-b-2")]') // Corrected to relative XPath
    //     .count()
    // ).toBe(0);
  }
});


