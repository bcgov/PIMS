// NOTE: these cant be imports as they are outside a module
const https = require("https");
const path = require("path");

const LOCAL_TEST = false;
const TEST_PACKAGEJSON_PATHS = ["src/frontend", "src/backend"];

/**
 * THIS FILE DOES NOT REQUIRE ANY EDITING.
 * Place within .github/helpers/npm-deps/
 *
 * To test this file locally,
 * - Set LOCAL_TEST variable to true.
 * - Edit TEST_PACKAGEJSON_PATHS if necessary.
 * - From root, run "node .github/helpers/npm-deps/parse-npm-deps.cjs > outdatedDeps.json"
 * - Check the outdatedDeps.json file, then delete it.
 */

// Get package.json paths from env.
const packageJsonPaths = LOCAL_TEST
	? TEST_PACKAGEJSON_PATHS
	: JSON.parse(process.env.packageJsonPaths);

// Save results to json.
const results = {};

// Save information on the dependency including latestVersion to the above results arrays.
const saveDependencyResults = (
	packagePath,
	isDevDep,
	dependency,
	version,
	latestVersion,
) => {
	// Create arrays of version triplets  ie. 2.7.4  >>  [2, 7, 4]
	const versionTriplet = version.split(".");
	const latestVersionTriplet = latestVersion.split(".");

	// Determine version change.
	let versionChange = "patch";
	if (versionTriplet[0] !== latestVersionTriplet[0]) versionChange = "major";
	else if (versionTriplet[1] !== latestVersionTriplet[1])
		versionChange = "minor";

	// Save results.
	const saveInfo = {
		dependency,
		version,
		latestVersion,
	};

	if (isDevDep)
		results[packagePath].devDeps[versionChange].push(saveInfo); // devDep.
	else results[packagePath].deps[versionChange].push(saveInfo); // dep.
};

// Check the latest version of each dependency.
const checkVersions = async (dependencyList, packagePath, isDevDep) => {
	// For each dependency in the dependencyList.
	for (let key in dependencyList) {
		const [dependency, version] = dependencyList[key];
		const url = `https://registry.npmjs.org/${dependency}/latest`;

		// Add to total.
		if (isDevDep) ++results[packagePath].devDeps.total;
		else ++results[packagePath].deps.total;

		try {
			// Make an http request to the npm registry.
			const data = await new Promise((resolve, reject) => {
				https.get(url, (res) => {
					let data = "";
					res.on("data", (chunk) => {
						data += chunk;
					});
					res.on("end", () => {
						resolve(data);
					});
					res.on("error", (error) => {
						reject(error);
					});
				});
			});

			// Parse response data for latest version.
			const latestVersion = JSON.parse(data).version;

			// Check if theres a difference in version and latestVersion.
			if (
				latestVersion &&
				latestVersion !== "0.0.0" &&
				latestVersion !== version
			) {
				if (!latestVersion.includes("-"))
					saveDependencyResults(
						packagePath,
						isDevDep,
						dependency,
						version,
						latestVersion,
					);
				else {
					// Latest version includes '-'.
					const data = await new Promise((resolve, reject) => {
						https.get(`https://registry.npmjs.org/${dependency}`, (res) => {
							let data = "";
							res.on("data", (chunk) => {
								data += chunk;
							});
							res.on("end", () => {
								resolve(data);
							});
							res.on("error", (error) => {
								reject(error);
							});
						});
					});

					const versions = Object.keys(JSON.parse(data).versions);
					// Remove all versions containing '-' and select the last item in the array.
					const filteredLatestVersions = versions.filter(
						(item) => !item.includes("-"),
					);
					const latestVersion =
						filteredLatestVersions[filteredLatestVersions.length - 1];

					if (latestVersion !== version)
						saveDependencyResults(
							packagePath,
							isDevDep,
							dependency,
							version,
							latestVersion,
						);
				}

				// Add to outdated sum.
				if (isDevDep) ++results[packagePath].devDeps.outdated;
				else ++results[packagePath].deps.outdated;
			}
		} catch (error) {
			console.error(`Error checking ${dependency}: ${error.message}`);
		}
	}
};

(async () => {
	// Create an array of promises for each packageJsonPath.
	const promises = packageJsonPaths.map(async (packagePath) => {
		const packageJson = require(
			path.resolve(__dirname, `../../../${packagePath}/package.json`),
		);
		results[packagePath] = {
			deps: { total: 0, outdated: 0, major: [], minor: [], patch: [] },
			devDeps: { total: 0, outdated: 0, major: [], minor: [], patch: [] },
		};

		// Read the package.json file and get the list of dependencies and devDependencies.
		const deps = Object.entries(packageJson.dependencies) ?? [];
		const devDeps = Object.entries(packageJson.devDependencies) ?? [];

		// Await the completion of version checks for both dependencies and devDependencies.
		await Promise.all([
			checkVersions(deps, packagePath, false),
			checkVersions(devDeps, packagePath, true),
		]);
	});

	// Wait for all package checks to complete.
	await Promise.all(promises);

	// Once all promises are resolved, log the results.
	console.log(JSON.stringify(results, null, 2));
})();
