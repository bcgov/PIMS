const {
  createIssue,
  closeIssue,
  findIssueByTitle,
} = require("./github-api-requests");

/**
 * FILE DOES NOT NEED TO BE EDITED.
 * Place within .github/helpers/github-api/
 */

const createAndCloseExistingIssue = async (packageJsonPath, issueBody) => {
  const issueTitle =
    packageJsonPath !== "."
      ? `${packageJsonPath} NPM Dependency Report`
      : "NPM Dependency Report";

  // Check for existing Issue.
  const existingIssueNumber = await findIssueByTitle(issueTitle);

  if (existingIssueNumber && !Number.isNaN(Number(existingIssueNumber))) {
    // Close old Issue.
    await closeIssue(Number(existingIssueNumber));
  }

  // Create new Issue.
  await createIssue(issueTitle, decodeURIComponent(issueBody));
};

module.exports = createAndCloseExistingIssue;
