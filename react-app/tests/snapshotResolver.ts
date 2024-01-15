/**
 *
 * @param testPath Path of the test file being test3ed
 * @param snapshotExtension The extension for snapshots (.snap usually)
 */
const resolveSnapshotPath = (testPath, snapshotExtension) => {
  const snapshotFilePath = testPath + snapshotExtension; //(i.e. some.test.js + '.snap')
  return snapshotFilePath;
};

/**
 *
 * @param snapshotFilePath The filename of the snapshot (i.e. some.test.js.snap)
 * @param snapshotExtension The extension for snapshots (.snap)
 */
const resolveTestPath = (snapshotFilePath, snapshotExtension) => {
  const testPath = snapshotFilePath.replace(snapshotExtension, '').replace('__snapshots__/', ''); //Remove the .snap
  return testPath;
};

/* Used to validate resolveTestPath(resolveSnapshotPath( {this} )) */
const testPathForConsistencyCheck = 'some.test.js';

export default {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck,
};
