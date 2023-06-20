const { createIssue, closeIssue, findIssueByTitle } = require('./github-api-requests');
const ISSUE_BODY = require('../../../output.txt');
const { ISSUE_TITLE } = process.env;

(async () => {
  // Check for existing Issue.
  const existingIssueNumber = await findIssueByTitle(ISSUE_TITLE);

  if (existingIssueNumber && !Number.isNaN(Number(existingIssueNumber))) {
    // Close old Issue.
    await closeIssue(Number(existingIssueNumber));
  }

  // Create new Issue.
  await createIssue(ISSUE_TITLE, ISSUE_BODY);
})();
