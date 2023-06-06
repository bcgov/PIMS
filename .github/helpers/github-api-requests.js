const { Octokit } = require('@octokit/rest');

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Create an Issue with the GitHub REST API.
 * @param {string} owner - The GitHub username of the repository owner.
 * @param {string} repo - The name of the repository where the issue should be created.
 * @param {string} title - The title for the new issue.
 * @param {string} body - The content body for the new issue.
 * @returns request.data - Data returned by the request.
 * @example
 * createIssue(context.repo.owner, context.repo.repo, 'My Issue', 'An example issue');
 */
async function createIssue(owner, repo, title, body) {
  const request = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
  });
  console.log(request.data);
  return request;
}

/**
 * Close an Issue with the GitHub REST API.
 * @param {string} owner - The GitHub username of the repository owner.
 * @param {string} repo - The name of the repository where the issue should be created.
 * @param {number} issue_number - The id for a GitHub Issue.
 * @returns request.data - Data returned by the request.
 * @example
 * closeIssue(context.repo.owner, context.repo.repo, 1044);
 */
async function closeIssue(owner, repo, issue_number) {
  const request = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number,
    state: 'closed',
  });
  console.log(request.data);
  return request;
}

/**
 * Find an Issue's ID number with the GitHub REST API, given a title.
 * @param {string} owner - The GitHub username of the repository owner.
 * @param {string} repo - The name of the repository where the issue should be created.
 * @param {string} title - The title of the issue to search for.
 * @param {string} state - (optional, default=open) Search for all, open, or closed issues.
 * @returns issue.number or null
 * @example
 * findIssueByTitle(context.repo.owner, context.repo.repo, 'My Issue');
 */
async function findIssueByTitle(owner, repo, title, state = 'open') {
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state, // Get issues that are 'open', 'closed' or 'all'.
  });

  for (const issue of issues) {
    if (issue.title === title) {
      return issue.number;
    }
  }
  return null; // Return null if no issue found.
}

module.exports = {
  createIssue,
  closeIssue,
  findIssueByTitle,
};
