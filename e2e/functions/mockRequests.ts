import { Page } from "@playwright/test";

interface User {
  CreatedById: string;
  CreatedOn: string;
  UpdatedById: string;
  UpdatedOn: string;
  Id: string;
  Username: string;
  FirstName: string;
  MiddleName: string | null;
  LastName: string;
  Email: string;
  Position: string;
  Note: string | null;
  LastLogin: string;
  ApprovedById: string;
  ApprovedOn: string;
  KeycloakUserId: string;
  AgencyId: number;
  RoleId: string | undefined;
  Status: string;
}

/**
 * Use this at the start of a test to set your user information if needed.
 * Otherwise, your user information will reflect the actual user credentials used in testing.
 * @param page Page of e2e test.
 * @param self A partial object with user attributes.
 * @param status An optional status number. Defaults to 200.
 */
export const mockSelf = async (page: Page, self?: Partial<User>, status: number = 200) => {
  // Make the actual call, but then edit it with any partial user passed in before it gets back to the page
  await page.route('**/users/self', async route => {
    const response = await route.fetch();
    let json = await response.json();
    json = {
      ...json,
      ...self
    }
    await route.fulfill({ response, json });
  })
};
