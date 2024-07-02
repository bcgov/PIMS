/**
 * Reusable functions for making requests to the GitHub REST API.
 * @author Brady Mitchell <braden.jr.mitch@gmail.com | braden.mitchell@gov.bc.ca>
 * API Documentation: https://octokit.github.io/rest.js/v19#usage
 *
 * THIS FILE DOES NOT NEED TO BE EDITED, but you can add more functions if desired.
 * Place within .github/helpers/github-api/
 *
 * - Be sure to include the env variables from below!
 *
 * @example GitHub Actions Workflow:
 * jobs:
 *   github-api:
 *     runs-on: ubuntu-22.04
 *     container:
 *       image: node:20.2-bullseye-slim
 *
 *     steps:
 *       # Checkout branch.
 *       - name: Checkout repository
 *         uses: actions/checkout@v3
 *
 *       # Get Repo Owner and Repo Name.
 *       - name: Set repo information
 *         run: |
 *           echo "REPO_OWNER=$(echo ${{ github.repository }} | cut -d / -f 1)" >> $GITHUB_ENV
 *           echo "REPO_NAME=$(echo ${{ github.repository }} | cut -d / -f 2)" >> $GITHUB_ENV
 *
 *       # Install @octokit/rest npm package for making GitHub rest API requests.
 *       - name: Install @octokit/rest npm
 *         run: npm i @octokit/rest
 *
 *       # Run Node Script that calls functions from github-api-requests.js.
 *       - name: Node Script
 *         env:
 *           GITHUB_OWNER: ${{ env.REPO_OWNER }}
 *           GITHUB_REPO: ${{ env.REPO_NAME }}
 *           GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
 *         run: node .github/helpers/script.js
 */

import { Octokit } from '@octokit/rest';
const { GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
const [GITHUB_OWNER, GITHUB_REPO] = GITHUB_REPOSITORY.split("/");

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Create an Issue with the GitHub REST API.
 * @param {string} title - The title for the new issue.
 * @param {string} body - The content body for the new issue.
 * @returns request.data - Data returned by the request.
 * @example
 * createIssue('My Issue', 'An example issue');
 */
async function createIssue(title, body) {
  const request = await octokit.rest.issues.create({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    title,
    body,
  });
  console.log(request.data);
  return request;
}

/**
 * Close an Issue with the GitHub REST API.
 * @param {number} issue_number - The id for a GitHub Issue.
 * @returns request.data - Data returned by the request.
 * @example
 * closeIssue(1044);
 */
async function closeIssue(issue_number) {
  const request = await octokit.rest.issues.update({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    issue_number,
    state: "closed",
  });
  console.log(request.data);
  return request;
}

/**
 * Find an Issue's ID number with the GitHub REST API, given a title.
 * @param {string} title - The title of the issue to search for.
 * @param {string} state - (optional, default=open) Search for all, open, or closed issues.
 * @returns issue.number or null
 * @example
 * findIssueByTitle('My Issue');
 */
async function findIssueByTitle(title, state = "open") {
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
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
