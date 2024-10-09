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
 * For creating a user object normally returned by the /self route
 * @param props A Partial user object
 * @returns 
 */
const createSelfResponse = (props?: Partial<User>): User => ({
  "CreatedById": "00000000-0000-0000-0000-000000000000",
  "CreatedOn": "2023-07-25T00:32:41.938Z",
  "UpdatedById": "a619c656-b263-4a17-9b87-03459f43b349",
  "UpdatedOn": "2024-10-09T23:49:47.650Z",
  "Id": "a619c656-b263-4a17-9b87-03459f43b352",
  "Username": "a619c656b2634a179b8703459f43b529@idir",
  "FirstName": "Joe",
  "MiddleName": null,
  "LastName": "Tester",
  "Email": "user.email@gov.bc.ca",
  "Position": "Developer",
  "Note": null,
  "LastLogin": "2024-10-09T16:49:47.629Z",
  "ApprovedById": "80e0111a-b56c-48dd-b55e-f99f2205c4bd",
  "ApprovedOn": "2023-08-26T03:03:47.911Z",
  "KeycloakUserId": "a619c656-b263-4a17-9b87-03459f43b352",
  "AgencyId": 2,
  "RoleId": "00000000-0000-0000-0000-000000000000",
  "Status": "Active",
  ...props,
})

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
