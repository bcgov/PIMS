const https = require('https');

const RESET = '\x1b[0m';
const RED = '\x1b[1m\x1b[31m';
const GREEN = '\x1b[1m\x1b[32m';
const YELLOW = '\x1b[1m\x1b[33m';
const AQUA = '\x1b[1m\x1b[36m';
const WHITE = '\x1b[1m\x1b[37m';

// Read the package.json file and get the list of dependencies and devDependencies.
const packageJson = require('./package.json');
const dependencies = Object.keys(packageJson.dependencies);
const devDependencies = Object.keys(packageJson.devDependencies);

// Check the latest version of each dependency.
const checkVersions = async () => {
  // Loop through the list of dependencies.
  for (let i = 0; i < dependencies.length; i++) {
    // Get the name of the dependency and the URL of its latest version.
    const dep = dependencies[i];
    const url = `https://registry.npmjs.org/${dep}/latest`;

    // Make an HTTP request to get the latest version of the dependency.
    https.get(url, res => {
      let data = '';

      // When the response receives data, add it to the 'data' variable.
      res.on('data', chunk => {
        data += chunk;
      });

      // When the response ends, parse the data as JSON and compare the current and latest versions.
      res.on('end', () => {
        const latestVersion = JSON.parse(data).version;
        const currentVersion = packageJson.dependencies[dep];
        let color = RESET;
        let versionType = '';

        // Determine the color and version type based on the
        // difference between the current and latest versions.
        if (latestVersion !== currentVersion) {
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

          // Output the current and latest versions of the dependency.
          console.log(
            `${AQUA}${dep}${RESET} - ${WHITE}Current:${RESET} ${currentVersion}, ${WHITE}Latest:${RESET} ${color}${latestVersion}${RESET} (${versionType})`,
          );
        }
      });
      res.on('error', () => {
        return;
      });
    });
  }
};

// Check the latest version of each dev dependency.
const checkDevVersions = async () => {
  // Loop through the list of dependencies.
  for (let i = 0; i < devDependencies.length; i++) {
    // Get the name of the dependency and the URL of its latest version.
    const dep = devDependencies[i];
    const url = `https://registry.npmjs.org/${dep}/latest`;

    // Make an HTTP request to get the latest version of the dependency.
    https.get(url, res => {
      let data = '';

      // When the response receives data, add it to the 'data' variable.
      res.on('data', chunk => {
        data += chunk;
      });

      // When the response ends, parse the data as JSON and compare the current and latest versions.
      res.on('end', () => {
        const latestVersion = JSON.parse(data).version;
        const currentVersion = packageJson.devDependencies[dep];
        let color = RESET;
        let versionType = '';

        // Determine the color and version type based on the
        // difference between the current and latest versions.
        if (latestVersion !== currentVersion) {
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

          // Output the current and latest versions of the dependency.
          console.log(
            `${AQUA}${dep}${RESET} - ${WHITE}Current:${RESET} ${currentVersion}, ${WHITE}Latest:${RESET} ${color}${latestVersion}${RESET} (${versionType})`,
          );
        }
      });
      res.on('error', () => {
        return;
      });
    });
  }
};

(async () => {
  await checkVersions();
  await checkDevVersions();
})();
