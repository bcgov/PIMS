const https = require('https');

const RESET = '\x1b[0m';
const RED = '\x1b[1m\x1b[31m';
const GREEN = '\x1b[1m\x1b[32m';
const YELLOW = '\x1b[1m\x1b[33m';
const AQUA = '\x1b[1m\x1b[36m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[1m\x1b[37m';

// Read the package.json file and get the list of dependencies and devDependencies.
const packageJson = require('./package.json');
const dependencies = Object.keys(packageJson.dependencies);
const devDependencies = Object.keys(packageJson.devDependencies);

// Check the latest version of each dependency.
const checkVersions = async dependencyList => {
  let updatableDeps = 0;
  const dependenciesToUpdate = []; // New array to hold dependencies to update
  // Loop through the list of dependencies.
  for (let i = 0; i < dependencyList.length; i++) {
    // Get the name of the dependency and the URL of its latest version.
    const dep = dependencyList[i];
    const url = `https://registry.npmjs.org/${dep}/latest`;

    // Make an HTTP request to get the latest version of the dependency.
    try {
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

      // When the response ends, parse the data as JSON and compare the current and latest versions.
      const latestVersion = JSON.parse(data).version;
      const currentVersion =
        dependencyList === dependencies
          ? packageJson.dependencies[dep]
          : packageJson.devDependencies[dep];
      let color = RESET;
      let versionType = '';

      // Determine the color and version type based on the
      // difference between the current and latest versions.
      if (latestVersion !== currentVersion) {
        updatableDeps += 1;
        const currentParts = currentVersion.split('.');
        const latestParts = latestVersion.split('.');
        if (currentParts[0] !== latestParts[0]) {
          color = RED;
          versionType = 'Major';
        } else if (currentParts[1] !== latestParts[1]) {
          color = YELLOW;
          versionType = 'Minor';
        } else {
          color = GREEN;
          versionType = 'Patch';
        }

        // Add the dependency and its latest version to the new array
        dependenciesToUpdate.push(`${dep}@latest`);
        // Output the current and latest versions of the dependency.
        console.log(
          `${AQUA}${dep}${RESET} - ${WHITE}Current:${RESET} ${currentVersion}, ${WHITE}Latest:${RESET} ${color}${latestVersion}${RESET} (${versionType})`,
        );
      }
    } catch (error) {
      console.error(`Error checking ${dep}: ${error.message}`);
    }
  }
  if (updatableDeps === 0) console.log(`${GREEN}No updates found.${RESET}`);
  else {
    const isDevDeps = dependencyList === devDependencies;
    // Output the npm install command with all the new versions.
    console.log(
      `\nRun ${CYAN}npm i${isDevDeps ? ' -D' : ''} ${dependenciesToUpdate.join(
        ' ',
      )}${RESET} to update the dependencies.`,
    );
  }
};

(async () => {
  console.log(`Dependencies:`);
  await checkVersions(dependencies);
  console.log(`\n\nDev Dependencies:`);
  await checkVersions(devDependencies);
})();
