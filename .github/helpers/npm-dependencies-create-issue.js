const { createIssue, closeIssue, findIssueByTitle } = require('./github-api-requests');
const { GITHUB_OWNER, GITHUB_REPO, ISSUE_TITLE, ISSUE_BODY } = process.env;

(async () => {
  // Check for existing Issue.
  const existingIssueNumber = await findIssueByTitle(GITHUB_OWNER, GITHUB_REPO, ISSUE_TITLE);

  if (existingIssueNumber && Number(existingIssueNumber) !== 'NaN') {
    // Close old Issue.
    await closeIssue(GITHUB_OWNER, GITHUB_REPO, Number(existingIssueNumber));
  }

  // Create new Issue.
  await createIssue(GITHUB_OWNER, GITHUB_REPO, ISSUE_TITLE, ISSUE_BODY);
})();
