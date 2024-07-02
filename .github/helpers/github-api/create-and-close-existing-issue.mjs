import { createIssue, closeIssue, findIssueByTitle } from './github-api-requests.mjs';

/**
 * FILE DOES NOT NEED TO BE EDITED.
 * Place within .github/helpers/github-api/
 */

export const createAndCloseExistingIssue = async (issueTitle, issueBody) => {
  // Check for existing Issue.
  const existingIssueNumber = await findIssueByTitle(issueTitle);

  if (existingIssueNumber && !Number.isNaN(Number(existingIssueNumber))) {
    // Close old Issue.
    await closeIssue(Number(existingIssueNumber));
  }

  // Create new Issue.
  await createIssue(issueTitle, decodeURIComponent(issueBody));
};

export default createAndCloseExistingIssue;
