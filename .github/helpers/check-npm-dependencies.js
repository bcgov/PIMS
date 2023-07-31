const https = require('https');
const path = require('path');

/**
 * THIS FILE DOES NOT REQUIRE ANY EDITING.
 * Place within .github/helpers/
 */

// Get package.json file.
const cmdLineArgument = process.env.PACKAGE_JSON;
const packageJsonPath = cmdLineArgument.startsWith('./')
  ? path.resolve(`${cmdLineArgument}/package.json`)
  : path.resolve(`./${cmdLineArgument}/package.json`);
const packageJson = require(packageJsonPath);

// Read the package.json file and get the list of dependencies and devDependencies.
const dependencies = Object.entries(packageJson.dependencies) ?? undefined;
const devDependencies = Object.entries(packageJson.devDependencies) ?? undefined;

// Results from running checkVersions.
const dependencyResults = [];
const devDependencyResults = [];

// Save information on the dependency including latestVersion to the above results arrays.
const saveDependencyResults = (dependencyList, dependency, version, latestVersion) => {
  // Create arrays of version triplets  ie. 2.7.4  >>  [2, 7, 4]
  const versionTriplet = version.split('.');
  const latestVersionTriplet = latestVersion.split('.');

  // Determine version change.
  let versionChange = 'Patch';
  if (versionTriplet[0] !== latestVersionTriplet[0]) {
    versionChange = 'Major';
  } else if (versionTriplet[1] !== latestVersionTriplet[1]) {
    versionChange = 'Minor';
  }

  // Save results.
  const isDevDependencies = dependencyList === devDependencies;
  const saveInfo = {
    dependency,
    version,
    latestVersion,
    versionChange,
  };
  if (isDevDependencies) {
    devDependencyResults.push(saveInfo); // DevDependency.
  } else {
    dependencyResults.push(saveInfo); // Dependency.
  }
};

// Check the latest version of each dependency.
const checkVersions = async (dependencyList) => {
  // For each dependency in the dependencyList.
  for (let key in dependencyList) {
    const [dependency, version] = dependencyList[key];
    const url = `https://registry.npmjs.org/${dependency}/latest`;

    try {
      // Make an http request to the npm registry.
      const data = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data);
          });
          res.on('error', (error) => {
            reject(error);
          });
        });
      });

      // Parse response data for latest version.
      const latestVersion = JSON.parse(data).version;

      // Check if theres a difference in version and latestVersion.
      if (latestVersion && latestVersion !== '0.0.0' && latestVersion !== version) {
        if (!latestVersion.includes('-'))
          saveDependencyResults(dependencyList, dependency, version, latestVersion);
        else {
          // Latest version includes '-'.
          const data = await new Promise((resolve, reject) => {
            https.get(`https://registry.npmjs.org/${dependency}`, (res) => {
              let data = '';
              res.on('data', (chunk) => {
                data += chunk;
              });
              res.on('end', () => {
                resolve(data);
              });
              res.on('error', (error) => {
                reject(error);
              });
            });
          });

          const versions = Object.keys(JSON.parse(data).versions);
          // Remove all versions containing '-' and select the last item in the array.
          const filteredLatestVersions = versions.filter((item) => !item.includes('-'));
          const latestVersion = filteredLatestVersions[filteredLatestVersions.length - 1];

          if (latestVersion !== version)
            saveDependencyResults(dependencyList, dependency, version, latestVersion);
        }
      }
    } catch (error) {
      console.error(`Error checking ${dependency}: ${error.message}`);
    }
  }
};

// GitHub Markdown Formatting.
const heading2 = (text) => `## ${text}`;
const heading3 = (text) => `### ${text}`;
const codeBlock = (text, language) => `\`\`\` ${language}\n${text}\n\`\`\``;
const breakLine = () => console.log(`\n<br />\n`);

// Log Dependencies in an array.
const logDeps = (dependencies, header, isDevDep, color) => {
  const headerTag = isDevDep ? `${header}_dev` : `${header}`;
  if (dependencies.length > 0) {
    breakLine();
    console.log(`![${headerTag}]`); // Header

    // List dependency updates.
    for (let key in dependencies) {
      const { dependency, version, latestVersion } = dependencies[key];
      console.log(
        `- \`${dependency}\` Update from version \`${version}\` to \`${latestVersion}\` by running`,
      );
      console.log(
        codeBlock(`npm install${isDevDep ? ' -D' : ''} ${dependency}@${latestVersion}`, ''),
      );
    }

    // Add Header text
    console.log(
      `[${headerTag}]: https://img.shields.io/badge/${header}_updates_(${dependencies.length})-${color}?style=for-the-badge \n`,
    );
  }
};

// Run checkVersions and create comment.
(async () => {
  const check = '✔️';
  const attention = '⚠️';

  await checkVersions(dependencies);
  await checkVersions(devDependencies);

  console.log(heading2('NPM Dependency Versions Check'));
  console.log(
    'Versions of npm packages have been checked against their latest versions from the npm registry.\n',
  );

  // Badge color codes (checked for WCAG standards).
  const red = '701807'; // White text.
  const orange = '9e3302'; // White text.
  const yellow = 'f5c60c'; // Black text.
  const green = '0B6018'; // White text.
  const blue = '0859A1'; // White text.

  // Percentage of packages up to date.
  const dependenciesUpToDate = dependencies.length - dependencyResults.length;
  const devDependenciesUpToDate = devDependencies.length - devDependencyResults.length;
  const totalDependenciesUpToDate = dependenciesUpToDate + devDependenciesUpToDate;

  const totalPercentageUpToDate = Math.round(
    (totalDependenciesUpToDate / (dependencies.length + devDependencies.length)) * 100,
  );

  let percentageColor = green;
  if (totalPercentageUpToDate <= 50) percentageColor = red;
  else if (totalPercentageUpToDate <= 70) percentageColor = orange;
  else if (totalPercentageUpToDate <= 90) percentageColor = yellow;

  // Log percentage
  console.log('![COVERAGE_PERCENTAGE]');
  console.log(
    `\n[COVERAGE_PERCENTAGE]: https://img.shields.io/badge/percentage_of_dependencies_up_to_date-${totalPercentageUpToDate}-${percentageColor}?style=for-the-badge \n`,
  );

  // Summarize dependency updates.
  if (dependencyResults.length === 0) {
    console.log(`${check} - Production dependencies are all up-to-date.`);
  } else {
    console.log(
      `${attention} - ${dependencyResults.length} Production dependencies are out-of-date.`,
    );
  }

  // Summarize devDependency updates.
  if (devDependencyResults.length === 0) {
    console.log(`${check} - Dev dependencies are all up-to-date.`);
  } else {
    console.log(`${attention} - ${devDependencyResults.length} Dev dependencies are out-of-date.`);
  }

  // Remind to change directory before installing updates.
  if (dependencyResults.length > 0 || devDependencyResults.length > 0) {
    console.log(
      `\n**Make sure to change directory to where the package.json is located using...**`,
    );
    console.log(codeBlock(`cd ${process.env.PACKAGE_JSON}`, ''));
  }

  // STANDARD DEPENDENCIES
  if (dependencyResults.length > 0) {
    breakLine();
    console.log(heading3('Production Dependencies to Update:'));

    // Seperate by patch, minor and major.
    const patchDependencies = dependencyResults.filter((dep) => dep.versionChange === 'Patch');
    const minorDependencies = dependencyResults.filter((dep) => dep.versionChange === 'Minor');
    const majorDependencies = dependencyResults.filter((dep) => dep.versionChange === 'Major');

    logDeps(patchDependencies, 'patch', false, green);
    logDeps(minorDependencies, 'minor', false, blue);
    logDeps(majorDependencies, 'major', false, orange);
  }

  // DEV DEPENDENCIES
  if (devDependencyResults.length > 0) {
    breakLine();
    console.log(heading3('Dev Dependencies to Update:'));

    // Seperate by patch, minor and major.
    const patchDependencies = devDependencyResults.filter((dep) => dep.versionChange === 'Patch');
    const minorDependencies = devDependencyResults.filter((dep) => dep.versionChange === 'Minor');
    const majorDependencies = devDependencyResults.filter((dep) => dep.versionChange === 'Major');

    logDeps(patchDependencies, 'patch', true, green);
    logDeps(minorDependencies, 'minor', true, blue);
    logDeps(majorDependencies, 'major', true, orange);
  }
})();
