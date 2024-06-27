const path = require("path");
const outdatedDeps = require(path.resolve(
  __dirname,
  `../../outdatedDeps.json`
));

const LOCAL_TEST = false;
const TEST_PACKAGEJSON_PATHS = ["src/react-app", "src/express-api"];

/**
 * THIS FILE DOES NOT REQUIRE ANY EDITING.
 * Place within .github/helpers/
 *
 * To test this file locally,
 * - Generate output from parse-npm-deps.js
 * - Set LOCAL_TEST variable to true.
 * - Edit TEST_PACKAGEJSON_PATHS if necessary.
 * - From root, run "node .github/helpers/create-npm-dep-report > outputText.json"
 * - Check the outputText.json file, then delete it.
 */

// Get package.json paths from env.
const packageJsonPaths = LOCAL_TEST
  ? TEST_PACKAGEJSON_PATHS
  : JSON.parse(process.env.packageJsonPaths);

// Save results to json.
let results = {};

// Emojis.
const check = "✔️";
const attention = "⚠️";

// Badge color codes (checked for WCAG standards).
const red = "701807"; // White text.
const orange = "9e3302"; // White text.
const yellow = "f5c60c"; // Black text.
const green = "0B6018"; // White text.
const blue = "0859A1"; // White text.

// GitHub Markdown Formatting.
const heading = (text, size) => `${"#".repeat(size)} ${text}\n`;
const codeBlock = (text, language) => `\`\`\`${language}\n${text}\n\`\`\`\n\n`;
const lineBreak = () => `\n<br />\n`;
const line = (text) => `${text}\n`;

// Formatted date.
const getFormattedDate = () => {
  const date = new Date();

  // Get day of the month.
  const day = date.getDate();

  // Determine the ordinal suffix.
  const ordinal = (day) => {
    const s = ["th", "st", "nd", "rd"];
    const v = day % 100;
    return day + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Formatter for the rest of the date.
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the date and replace the day number with ordinal.
  return formatter.format(date).replace(/\d+/, ordinal(day));
};

// Messages.
const title = `NPM Dependency Report - ${getFormattedDate()}`;
const subTitle =
  "Versions of npm packages have been checked against their latest versions from the npm registry.";
const upToDateMsg = "dependencies are all up-to-date.";
const outOfDateMsg = "dependencies are out-of-date.";

// Calculate percentage of packages up to date.
const calculateUpToDatePercentage = (total, outdated) => {
  if (total === 0) return 0;

  const upToDatePackages = total - outdated;
  const percentage = (upToDatePackages / total) * 100;
  return Math.round(percentage);
};

// Output a command to install all dependencies in array.
const outputMultiPackageInstallCmd = (dependencies, packagePath, isDevDep) => {
  let installCmd = `npm install${isDevDep ? " -D" : ""} `;
  installCmd += dependencies
    .map((obj) => `${obj.dependency}@${obj.latestVersion}`)
    .join(" ");

  results[packagePath] += `${codeBlock(installCmd, "")}\n`;
};

// Output Dependencies in an array.
const outputDepsByVersionChange = (
  dependencies,
  versionChange,
  packagePath,
  isDevDep
) => {
  const headerTag = isDevDep ? `${versionChange}_dev` : `${versionChange}`;
  const badgeColor =
    versionChange === "major"
      ? orange
      : versionChange === "minor"
      ? blue
      : green;

  // Output header.
  results[packagePath] += `${line(`![${headerTag}]`)}\n\n`;

  // Output start of spoiler.
  results[packagePath] += `${line(`<details>`)}\n`;
  results[packagePath] += `${line(`<summary>`)}`;
  results[packagePath] += `${line(
    `Expand to see individual installs. <br /><br />\n`
  )}`;

  // Output a command to install all dependencies in array.
  outputMultiPackageInstallCmd(dependencies, packagePath, isDevDep);

  // Output end of spoiler summary.
  results[packagePath] += `${line(`</summary>\n`)}`;

  // List dependency updates.
  for (const key in dependencies) {
    const { dependency, version, latestVersion } = dependencies[key];

    results[packagePath] += `${line(
      `- [ ] \`${dependency}\` Update from version \`${version}\` to \`${latestVersion}\` by running...`
    )}`;
    results[packagePath] += `${codeBlock(
      `npm install${isDevDep ? " -D" : ""} ${dependency}@${latestVersion}`,
      ""
    )}`;
  }

  // Output end of spoiler.
  results[packagePath] += `${line(`</details>\n`)}`;

  // Add Header text
  results[packagePath] += `${line(
    `[${headerTag}]: https://img.shields.io/badge/${versionChange}_updates_(${dependencies.length})-${badgeColor}?style=for-the-badge \n`
  )}`;

  results[packagePath] += `${lineBreak()}\n`;
};

// Output dependencies that need updating.
const outputDeps = (dependenciesObj, packagePath, isDevDep) => {
  // Return if no dependencies to update.
  if (dependenciesObj.outdated <= 0) return;

  // Output title.
  results[packagePath] += `${lineBreak()}\n`;
  if (isDevDep)
    results[packagePath] += `${heading(
      "Development Dependencies to Update:",
      3
    )}`;
  else
    results[packagePath] += `${heading(
      "Production Dependencies to Update:",
      3
    )}`;

  // Output MAJOR depedencies to update.
  const major = dependenciesObj.major;
  if (major.length > 0)
    outputDepsByVersionChange(major, "major", packagePath, isDevDep);

  // Output MINOR depedencies to update.
  const minor = dependenciesObj.minor;
  if (minor.length > 0)
    outputDepsByVersionChange(minor, "minor", packagePath, isDevDep);

  // Output PATCH depedencies to update.
  const patch = dependenciesObj.patch;
  if (patch.length > 0)
    outputDepsByVersionChange(patch, "patch", packagePath, isDevDep);
};

// Escape special characters for GitHub Actions.
const escapeForGitHubActions = (str) =>
  str.replace(/%/g, "%25").replace(/\n/g, "%0A").replace(/\r/g, "%0D");

(async () => {
  // Create an array of promises for each packageJsonPath.
  const promises = packageJsonPaths.map(async (packagePath) => {
    results[packagePath] = "";

    // Read the outdatedDeps file and get dependencies and devDependencies.
    const deps = outdatedDeps[packagePath].deps ?? {};
    const devDeps = outdatedDeps[packagePath].devDeps ?? {};

    // Output title.
    results[packagePath] += `${heading(title, 2)}`;
    results[packagePath] += `${line(subTitle)}\n`;

    // Get percentage of packages up to date.
    const percentageUpToDate = calculateUpToDatePercentage(
      deps.total + devDeps.total,
      deps.outdated + devDeps.outdated
    );

    let percentageColor = green;
    if (percentageUpToDate <= 50) percentageColor = red;
    else if (percentageUpToDate <= 70) percentageColor = orange;
    else if (percentageUpToDate <= 90) percentageColor = yellow;

    // Output percentage.
    results[packagePath] += `${line("![COVERAGE_PERCENTAGE]\n")}`;
    results[packagePath] += `${line(
      `\n[COVERAGE_PERCENTAGE]: https://img.shields.io/badge/percentage_of_dependencies_up_to_date-${percentageUpToDate}-${percentageColor}?style=for-the-badge \n\n`
    )}`;

    // Output summary.
    if (deps.outdated === 0)
      results[packagePath] += `${line(`${check} - Production ${upToDateMsg}`)}`;
    else
      results[packagePath] += `${line(
        `${attention} - ${deps.outdated} Production ${outOfDateMsg}`
      )}`;

    if (devDeps.outdated === 0)
      results[packagePath] += `${line(
        `${check} - Development ${upToDateMsg}`
      )}`;
    else
      results[packagePath] += `${line(
        `${attention} - ${devDeps.outdated} Development ${outOfDateMsg}`
      )}`;

    // Output reminder.
    if (deps.outdated > 0 || devDeps.outdated > 0) {
      results[packagePath] += `${line(
        `\n**Make sure to change directory to where the package.json is located using...**`
      )}`;
      results[packagePath] += `${codeBlock(`cd ${packagePath}`, "")}`;
    }

    // Await the completion of output for both dependencies and devDependencies.
    await Promise.all([
      outputDeps(deps, packagePath, false),
      outputDeps(devDeps, packagePath, true),
    ]);

    results[packagePath] = escapeForGitHubActions(results[packagePath]);
  });

  // Wait for all outputs to complete.
  await Promise.all(promises);

  // Once all promises are resolved, log the results.
  console.log(JSON.stringify(results, null, 2));
})();
