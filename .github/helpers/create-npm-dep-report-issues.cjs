const path = require("path");
const createAndCloseExistingIssue = require("./github-api/create-and-close-existing-issue");
const outputText = require(path.resolve(__dirname, `../../outputText.json`));

/**
 * THIS FILE DOES NOT REQUIRE ANY EDITING.
 * Place within .github/helpers/
 */

// Get package.json paths from env.
const packageJsonPaths = JSON.parse(process.env.packageJsonPaths);

(async () => {
  // Create an array of promises for each packageJsonPath.
  const promises = packageJsonPaths.map(async (packagePath) => {
    // Await the completion of create and close existing issue.
    await createAndCloseExistingIssue(packagePath, outputText[packagePath]);
  });

  // Wait for all issues to be created.
  await Promise.all(promises);
})();
