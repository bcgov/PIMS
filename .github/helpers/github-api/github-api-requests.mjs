/**
 * Reusable functions for making requests to the GitHub REST API.
 * @author Brady Mitchell <braden.jr.mitch@gmail.com | braden.mitchell@gov.bc.ca>
 * @editor Taylor Friesen <taylor.friesen@gov.bc.ca>
 * API Documentation: https://docs.github.com/en/rest
 *
 * THIS FILE DOES NOT NEED TO BE EDITED, but you can add more functions if desired.
 * Place within .github/helpers/github-api/
 */

import { Octokit } from "@octokit/rest";
const { GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
const [GITHUB_OWNER, GITHUB_REPO] = GITHUB_REPOSITORY.split("/");

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Create an Issue with the GitHub REST API.
 * @param {string} title - The title for the new issue.
 * @param {string} body - The content body for the new issue.
 * @returns - response - returned response from github.
 * @example
 * createIssue('My Issue', 'An example issue');
 */
export async function createIssue(title, body) {
	const response = await octokit.rest.issues.create({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		title,
		body,
	});
	//console.log("create issue: ", response.data);
	return response;
}

/**
 * Close an Issue with the GitHub REST API.
 * @param {number} issue_number - The id for a GitHub Issue.
 * @returns - response - returned response from github.
 * @example
 * closeIssue(1044);
 */
export async function closeIssue(issue_number) {
	const response = await octokit.rest.issues.update({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		issue_number,
		state: "closed",
	});
	//console.log("close issue: ", response.data);
	return response;
}

/**
 * Get issue number from title, and create a request to add a comment.
 * @param {*} issueNumber - the number for the issue to comment on
 * @param {*} issueComment - the comment to add
 * @returns - response - returned response from github.
 * @example
 *  addComment(1234, 'An example comment');
 */
export async function addComment(issueNumber, issueComment) {
	const response = await octokit.rest.issues.createComment({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		issue_number: issueNumber,
		body: issueComment,
	});
	//console.log("add comment: ", response.data);
	return response;
}

/**
 * Close a comment on an issue by referencing the ID
 * @param {*} commentID - the number associated with a comment
 * @returns - response - returned response from github.
 * @example
 *  deleteComment(1234);
 */
export async function deleteComment(commentID) {
	const response = await octokit.rest.issues.deleteComment({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		comment_id: commentID,
	});
	//console.log("delete comment: ", response.data);
	return response;
}

/**
 * Find an Issue's ID number with the GitHub REST API, given a title.
 * @param {string} title - The title of the issue to search for.
 * @param {string} state - (optional, default=open) Search for all, open, or closed issues.
 * @returns response from Github
 * @example
 * findIssueByTitle('My Issue');
 */
export async function findIssues(state = "open") {
	const response = await octokit.rest.issues.listForRepo({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		state, // Get issues that are 'open', 'closed' or 'all'.
	});
	//console.log("found issue: ", response.data);
	return response;
}

export default {
	createIssue,
	closeIssue,
	addComment,
	deleteComment,
	findIssues,
};
