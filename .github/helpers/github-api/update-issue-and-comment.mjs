import {
	createIssue,
	closeIssue,
	addComment,
	findIssues,
	deleteComment,
} from "./github-api-requests.mjs";

/**
 * FILE DOES NOT NEED TO BE EDITED.
 * Place within .github/helpers/github-api/
 */

const SUCCESS = 0;

const STATCODE = {
	Success: {
		200: "OK",
		201: "Resource created",
		204: "No response content",
	},
	Redirect: {
		301: "URL of the requested resource moved permanently",
		304: "Response has not been modified", // we aren't caching anything so this shouldnt be hit ever
	},
	Errors: {
		400: "Client Error: Bad client request, server can/will not process",
		401: "Client Error: Forbidden, bad authorization",
		403: "Client Error: Forbidden, not authorized",
		404: "Client Error: Resource not found",
		410: "Client Error: Gone (deleted)",
		422: "Client Error: Validation Failed/ Endpoint Spammed",
		503: "Server Error: Service Unailable",
	},
};

const timeout = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const checkStatus = (retInfo) => {
	const returnedStatus = retInfo.status;

	if (returnedStatus in STATCODE.Success) {
		// hit a listed successful code, return good code
		return SUCCESS;
	}
	let rcode = 0;
	let rtext = "";
	if (returnedStatus in STATCODE.Redirect) {
		// hit a redirect, return level warning
		rcode = returnedStatus;
		rtext = STATCODE.Redirect.returnedStatus;
	} else if (returnedStatus in STATCODE.Errors) {
		// hit an error update
		rcode = returnedStatus;
		rtext = STATCODE.Errors.returnedStatus;
	} else {
		// if we didnt get an expected status back return as much info as possible.
		rcode = returnedStatus;
		rtext = retInfo.data.message;
	}

	return { code: rcode, text: rtext };
};

const findIssueNumberByTitle = async (issueTitle) => {
	// Check for existing Issue.
	const foundIssueResp = await findIssues();
	// get more information
	const foundIssueStatusTranslated = checkStatus(foundIssueResp);
	// hit an error or warning. Send back code and info and exit.
	if (!(foundIssueStatusTranslated === SUCCESS)) {
		// didnt get successful response exit.
		return foundIssueStatusTranslated;
	}

	// if we are here we got a succesful response. Get the issue number
	const { data: issues } = foundIssueResp;
	// go through list of issues, if title matches return that number
	for (const issue of issues) {
		if (issue.title === issueTitle) {
			return issue.number;
		}
	}
	// if we dont find the right issue reurn null
	return null;
};

const closeAndCreateIssue = async (issueTitle, issueBody) => {
	// try to get number of old issue
	const issueNumber = await findIssueNumberByTitle(issueTitle);

	// if we have something returned from issues
	if (issueNumber) {
		// if what was returned is a number
		if (!Number.isNaN(Number(issueNumber))) {
			// close the issue.
			await closeIssue(Number(issueNumber));
		} else {
			// we hit an error or warning. return it.
			return issueNumber;
		}
		// if none was returned continue. no issue to close.
	}

	// Create new Issue.
	const newIssue = await createIssue(issueTitle, decodeURIComponent(issueBody));
	const newIssueStatus = checkStatus(newIssue);

	if (newIssueStatus !== SUCCESS) {
		// if we didnt make the new issue we have to exit
		return newIssueStatus;
	}

	// wait for issue to be created.
	timeout(2000).then(() => console.log("pausing for issue to be created..."));

	// return new issue number
	const newIssueNumber = newIssue.body.number;
	// wait for issue to be created.
	timeout(2000).then(() => console.log(newIssueNumber));
	return newIssueNumber;
};

const createAndCloseComment = async (issueNumber, issueComment) => {
	// Add comment to Issue.
	const newComment = await addComment(
		issueNumber,
		JSON.stringify(issueComment),
	);
	// chech status of creating comment
	const commentStatus = checkStatus(newComment);
	if (commentStatus !== SUCCESS) {
		// if we hit any error
		return commentStatus;
	}

	// pausing so that the comment is created, and webhook sent.
	timeout(2000).then(() => console.log("pausing for comment to be created..."));

	// get the comment id from the response data
	const commentID = newComment.data.id;

	// Deleting comment on issue
	const deleteResp = await deleteComment(commentID);
	// chech status of deleting comment
	const deleteStatus = checkStatus(deleteResp);
	if (deleteStatus !== SUCCESS) {
		// if we hit any error
		return deleteStatus;
	}
	// all good if we make it here.
	return SUCCESS;
};

export const updateIssueAndComment = async (
	issueTitle,
	issueBody,
	issueComment,
) => {
	// Await the completion of create and close existing issue.
	const newIssueNumber = await closeAndCreateIssue(issueTitle, issueBody);
	// if we dont get a number back we hit an error somewhere.
	if (Number.isNaN(Number(newIssueNumber))) {
		throw new Error("Unexpected response: ", newIssueNumber, "\nQuitting.");
	}

	// Await the completion of create and close comment
	const commentRes = await createAndCloseComment(
		Number(newIssueNumber),
		issueComment,
	);
	if (Number.isNaN(Number(commentRes))) {
		// if we dont get a number back we hit an error at some point.
		throw new Error("Unexpected response: ", commentRes, "\nQuitting.");
	}
};

export default updateIssueAndComment;
