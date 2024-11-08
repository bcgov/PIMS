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
  const new_issue = await createIssue(issueTitle, decodeURIComponent(issueBody));

  setTimeout(() => console.log("pausing for issue to be created..."), 1500);

  // get the issue number for the issue just created
  const newIssueNumber = new_issue['number'];

  // Add comment to Issue.
  await addComment(newIssueNumber, JSON.stringify(issueComment));
};

export default createAndCloseExistingIssue;
