import { readFileSync } from 'fs';
const latestTestRun = JSON.parse(readFileSync('./jest/latestTestRun.json'));

/**
 * Run `npm run test:output` to run the tests and output to file `latestTestRun.json`
 * Run `npm run test:summary` to output a summary of failed tests.
 */

const failedTests = [];

// For each test suite
latestTestRun.testResults.forEach(key => {
  let testSuite = key.name.split('\\');
  testSuite = testSuite[testSuite.length - 1];
  let tests = [];
  let hasFailedTests = false;

  // For each test
  key.assertionResults.forEach(key => {
    // Continue if test failed
    if (key.status === 'failed') {
      hasFailedTests = true;
      const title = key.title;

      // eslint-disable-next-line no-control-regex
      const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
      const failureMessages = key.failureMessages[0]
        .replace(ANSI_REGEX, '')
        .split('  at')[0]
        .split('Ignored nodes:')[0]
        .split('\n')
        .map(line => {
          return line.trim();
        })
        .filter(element => element !== '');

      // Push test to tests
      tests.push({ title, failureMessages });
    }
  });

  // Push test suite to failedTests
  if (hasFailedTests) failedTests.push({ testSuite, tests });
});

console.dir(failedTests, { depth: null, colors: true, breakLength: 50 });
