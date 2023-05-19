const https = require('https');

// Get package.json file.
const cmdLineArgument = process.argv.slice(2)[0];
const packageJsonPath = cmdLineArgument.startsWith('./') ? cmdLineArgument : `./${cmdLineArgument}`;
const packageJson = require(packageJsonPath);

// Read the package.json file and get the list of dependencies and devDependencies.
const dependencies = Object.entries(packageJson.dependencies) ?? undefined;
const devDependencies = Object.entries(packageJson.devDependencies) ?? undefined;

// Results from running checkVersions.
let dependencyResults = [];
let devDependencyResults = [];

// Check the latest version of each dependency.
const checkVersions = async dependencyList => {
  // For each dependency in the dependencyList.
  for (let key in dependencyList) {
    const [dependency, version] = dependencyList[key];
    const url = `https://registry.npmjs.org/${dependency}/latest`;

    try {
      // Make an http request to the npm registry.
      const data = await new Promise((resolve, reject) => {
        https.get(url, res => {
          let data = '';
          res.on('data', chunk => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data);
          });
          res.on('error', error => {
            reject(error);
          });
        });
      });

      // Parse response data for latest version.
      const latestVersion = JSON.parse(data).version;

      // Check if theres a difference in version and latestVersion.
      if (
        latestVersion &&
        latestVersion !== '0.0.0' &&
        latestVersion !== version &&
        !latestVersion.includes('-')
      ) {
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
          // DevDependency.
          devDependencyResults.push(saveInfo);
        } else {
          // Dependency.
          dependencyResults.push(saveInfo);
        }
      }
    } catch (error) {
      console.error(`Error checking ${dependency}: ${error.message}`);
    }
  }
};

// GitHub Markdown Formatting.
const heading2 = text => `## ${text}`;
const heading3 = text => `### ${text}`;
const codeBlock = (text, language) => `\n\`\`\` ${language}\n${text}\n\`\`\`\n`;

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

  // Summarize dependency updates.
  if (dependencyResults.length === 0) {
    console.log(`${check} - Standard dependencies are all up-to-date.`);
  } else {
    console.log(
      `${attention} - ${dependencyResults.length} Standard dependencies are out-of-date.`,
    );
  }

  // Summarize devDependency updates.
  if (devDependencyResults.length === 0) {
    console.log(`${check} - Dev dependencies are all up-to-date.`);
  } else {
    console.log(`${attention} - ${devDependencyResults.length} Dev dependencies are out-of-date.`);
  }

  // List dependencies to update.
  if (dependencyResults.length !== 0) {
    console.log(' ');
    console.log(heading3('Standard Dependencies to Update:'));
    console.log(
      codeBlock(
        '- Run all install commands from the directory where the package.json is located.',
        'Diff',
      ),
    );

    // Loop through each dependency to update.
    for (let key in dependencyResults) {
      const { dependency, version, latestVersion, versionChange } = dependencyResults[key];
      console.log(
        `- \`${dependency}\` Update by running \`npm install ${dependency}@${latestVersion}\``,
      );
      console.log(`  - Current version is \`${version}\` (${versionChange} update).`);
    }
  }

  // List devDependencies to update.
  if (devDependencyResults.length !== 0) {
    console.log(' ');
    console.log(heading3('Dev Dependencies to Update:'));
    console.log(
      codeBlock(
        '- Run all install commands from the directory where the package.json is located.',
        'Diff',
      ),
    );

    // Loop through each devDependency to update.
    for (let key in devDependencyResults) {
      const { dependency, version, latestVersion, versionChange } = devDependencyResults[key];
      console.log(
        `- \`${dependency}\` Update by running \`npm install -D ${dependency}@${latestVersion}\``,
      );
      console.log(`  - Current version is \`${version}\` (${versionChange} update).`);
    }
  }
})();
