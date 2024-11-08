// NOTE: these cant be imports as they are outside a module
const path = require("path");
const outputText = require(path.resolve(__dirname, `../../../outputText.json`));
const updateIssueAndComment = import(
	"../github-api/update-issue-and-comment.mjs"
);
const closeAndCreateIssue = updateIssueAndComment.closeAndCreateIssue;
const createAndCloseComment = updateIssueAndComment.createAndCloseComment;

/**
 * THIS FILE DOES NOT REQUIRE ANY EDITING.
 * Place within .github/helpers/npm-deps/
 */

// Get package.json paths and comment contents from env.
const packageJsonPaths = JSON.parse(process.env.packageJsonPaths);
const commentIn = JSON.parse(process.env.commentContents);

(async () => {
	// Create an array of promises for each packageJsonPath.
	const promises = packageJsonPaths.map(async (packagePath) => {
		// get the comment for this folder
		const comment = commentIn[packagePath];
		// create title
		const issueTitle =
			packagePath !== "."
				? `${packagePath} NPM Dependency Report`
				: "NPM Dependency Report";
		// Await the completion of create and close existing issue.
		const newIssueNumber = await closeAndCreateIssue(
			issueTitle,
			outputText[packagePath],
		);
		// if we dont get a number back we hit an error somewhere.
		if (Number.isNaN(Number(newIssueNumber))) {
			throw error("Unexpected response: ", newIssueNumber, "\nQuitting.");
		}

		// Await the completion of create and close comment
		const commentRes = await createAndCloseComment(
			Number(newIssueNumber),
			comment,
		);
		if (Number.isNaN(Number(commentRes))) {
			// if we dont get a number back we hit an error at some point.
			throw error("Unexpected response: ", commentRes, "\nQuitting.");
		}
	});

	// Wait for all issues to be created.
	try {
		await Promise.all(promises);
	} catch (e) {
		console.error("END WITH ERROR:\n ", e);
		exit();
	}
})();
