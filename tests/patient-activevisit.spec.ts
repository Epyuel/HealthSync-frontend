import { test, expect } from "@playwright/test";
import type {
  VisitsResponse,
} from "../components/models/visitModel";
import type { PatientResponse as PatientModel } from "../types/patient";

const formatDate = (dateInput: string | Date): string => {
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch (error) {
    return "Invalid date";
  }
};

test("Patients can view their active visits and details in tabs", async ({ page }) => {
  const loginEmail = "oliviajohnson@example.com";
  const password = "12345678@Mm";
  const baseApiUrl = "https://healthsync-backend-bfrv.onrender.com/api";
  const appUrl = "http://localhost:3000";

  await page.goto(appUrl + "/");
  // await page.getByText("Get Started").click();
  // await page.getByText("I'm patient").click();
  // await page.getByLabel("Phone").fill(loginEmail);
  // await page.getByLabel("Password").fill(password);
  // await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/patient/dashboard");

  const patientApiResponse = await page.request.get(`${baseApiUrl}/patients/me`);
  expect(patientApiResponse.ok()).toBeTruthy();

  const patientJsonOuter = (await patientApiResponse.json()) as {
    data: PatientModel;
    success: boolean;
  };
  const patientJson = patientJsonOuter.data;
  const patientId = patientJson._id;
  expect(patientId).toBeDefined();

  await page.getByRole("link", { name: "Active Visit" }).click();
  await page.waitForURL("**/patient/activevisits");

  const visitsApiResponse = await page.request.get(
    `${baseApiUrl}/visits?patient_id=${patientId}&status=Scheduled`
  );
  expect(visitsApiResponse.ok()).toBeTruthy();

  const visitsData: VisitsResponse = await visitsApiResponse.json();

  if (!visitsData.data?.visits || visitsData.data.visits.length === 0) {
    await expect(page.getByRole("heading", { name: /No Visit Records Found/i })).toBeVisible();
    await expect(
      page.getByText(/You don't have any visit records at the moment\./i)
    ).toBeVisible();
  } else {
    const visits = visitsData.data.visits;
    const activeVisit = visits[0];

    await expect(page.getByRole("heading", { name: "Visit Record" })).toBeVisible();
    await expect(page.getByText(`1 of ${visits.length}`)).toBeVisible();

    const expectedDateString = formatDate(
      activeVisit.startDate || activeVisit.preferredDate
    );
    await expect(page.getByText(expectedDateString)).toBeVisible();
    await expect(page.getByText(new RegExp(`ID: ${activeVisit._id.substring(0, 8)}`))).toBeVisible();
    await expect(page.getByText(new RegExp(`${activeVisit.status}`))).toBeVisible();

    await page.getByTestId("overview-tabs").click();
    await expect(page.getByText("Visit Details")).toBeVisible();

    if (activeVisit?.reason) {
      await expect(page.getByText("Reason for Visit")).toBeVisible();
      await expect(page.getByText(activeVisit.reason)).toBeVisible();
    }
    if (activeVisit?.diagnosis) {
      await expect(page.getByRole("heading", { name: "Diagnosis" })).toBeVisible();
      await expect(page.getByText(activeVisit.diagnosis)).toBeVisible();
    }
    if (activeVisit?.notes) {
      await expect(page.getByText("Doctor's Notes")).toBeVisible();
      await expect(page.getByText(activeVisit.notes)).toBeVisible();
    }
    if (!activeVisit?.reason && !activeVisit?.diagnosis && !activeVisit?.notes) {
      await expect(
        page.getByText("No overview details available for this visit.")
      ).toBeVisible();
    }

    await page.getByTestId("prescription-tabs").click();
    await expect(page.getByTestId("prescription-tabs-content").getByText("prescription")).toBeVisible();


    if (activeVisit?.prescription && activeVisit.prescription.length > 0) {
      for (const pres of activeVisit.prescription) {
        await expect(page.getByText(pres.medication)).toBeVisible();
        // await expect(page.getByText(`Dosage: ${pres.dosage}`, { exact: false })).toBeVisible();
        // await expect(page.getByText(`Instructions: ${pres.instructions}`)).toBeVisible();
      }
    } else {
      await expect(page.getByText("No prescriptions for this visit")).toBeVisible();
    }

    await page.getByTestId("labResults-tabs").click();
    await expect(page.getByTestId("labResults-tabs-content").getByText("Lab Results")).toBeVisible();

    if (activeVisit.labResults && activeVisit.labResults.length > 0) {
      for (const lab of activeVisit.labResults) {
        await expect(page.getByText(lab.testName)).toBeVisible();
        // await expect(page.getByText(`Normal Range: ${lab.normalRange}`)).toBeVisible();
        // await expect(page.getByText(`Unit: ${lab.unit}`)).toBeVisible();

        if (typeof lab.result === "string" && lab.result.startsWith("http")) {
          const img = page.locator(`img[alt='${lab.testName} result']`);
          await expect(page.getByAltText(`${lab.testName} result`)).toBeVisible();
        } else if (lab.result) {
          await expect(page.getByText(`Result: ${lab.result}`)).toBeVisible();
        }
      }
    } else {
      await expect(page.getByText("No lab results available")).toBeVisible();
    }
  }
});
