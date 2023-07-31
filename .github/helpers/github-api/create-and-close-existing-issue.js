const { createIssue, closeIssue, findIssueByTitle } = require('./github-api-requests');
const { ISSUE_TITLE, ISSUE_BODY, PATH_TO_PACKAGE_JSON } = process.env;

/**
 * FILE DOES NOT NEED TO BE EDITED.
 * Place within .github/helpers/github-api/
 */

(async () => {
  const defaultIssueTitle =
    PATH_TO_PACKAGE_JSON && PATH_TO_PACKAGE_JSON !== '.'
      ? `${PATH_TO_PACKAGE_JSON} NPM Dependency Updates`
      : 'NPM Dependency Updates';

  // Check for existing Issue.
  const existingIssueNumber = await findIssueByTitle(ISSUE_TITLE ?? defaultIssueTitle);

  if (existingIssueNumber && !Number.isNaN(Number(existingIssueNumber))) {
    // Close old Issue.
    await closeIssue(Number(existingIssueNumber));
  }

  // Create new Issue.
  await createIssue(ISSUE_TITLE, decodeURIComponent(ISSUE_BODY));
})();
