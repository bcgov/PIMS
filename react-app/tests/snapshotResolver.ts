/**
 *
 * @param testPath Path of the test file being test3ed
 * @param snapshotExtension The extension for snapshots (.snap usually)
 */
const resolveSnapshotPath = (testPath, snapshotExtension) => {
  const fileName = (testPath as string).substring(testPath.lastIndexOf('/') + 1);
  const snapshotFilePath = 'tests/__snapshots__/' + fileName + snapshotExtension; //(i.e. some.test.js + '.snap')
  return snapshotFilePath;
};

/**
 *
 * @param snapshotFilePath The filename of the snapshot (i.e. some.test.js.snap)
 * @param snapshotExtension The extension for snapshots (.snap)
 */
const resolveTestPath = (snapshotFilePath, snapshotExtension) => {
  const testPath = snapshotFilePath.replace(snapshotExtension, ''); //Remove the .snap
  return testPath;
};

/* Used to validate resolveTestPath(resolveSnapshotPath( {this} )) */
const testPathForConsistencyCheck = 'tests/__snapshots__/some.test.js';

export default {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck,
};
