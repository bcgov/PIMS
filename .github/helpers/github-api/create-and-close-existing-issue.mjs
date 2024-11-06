import { createIssue, closeIssue, addComment, findIssueByTitle } from './github-api-requests.mjs';

/**
 * FILE DOES NOT NEED TO BE EDITED.
 * Place within .github/helpers/github-api/
 */

export const createAndCloseExistingIssue = async (issueTitle, issueBody, issueComment) => {
  // Check for existing Issue.
  const existingIssueNumber = await findIssueByTitle(issueTitle);

  if (existingIssueNumber && !Number.isNaN(Number(existingIssueNumber))) {
    // Close old Issue.
    await closeIssue(Number(existingIssueNumber));
  }

  // Create new Issue.
  await createIssue(issueTitle, decodeURIComponent(issueBody));

  setTimeout(() => console.log("pausing for issue to be created..."), 2000);

  const newIssueNumber = await findIssueByTitle(issueTitle);

  // Add comment to Issue.
  await addComment(newIssueNumber, issueComment);
};

export default createAndCloseExistingIssue;
