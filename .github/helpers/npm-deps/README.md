# NPM Dependency Scripts

This README will go through the NPM Dependency Reports workflow (found in .github/workflows/app-npm-dep-check.yml.)

## Requirements

The following structure must be followed and all files present for the workflow to be run correctly.

```
# Note: only showing files required for this workflow to run.

<repo to run action in>
  | - config
  |   | - dep-report.json5
  | - helpers
  |   | - github-api
  |   |   | - create-and-close-existing-issue.mjs
  |   |   | - github-api-requiests.mjs
  |   | - npm-deps
  |   |   | - create-report-issues.cjs
  |   |   | - create-report.cjs
  |   |   | - parse-npm-deps.cjs
  | - workflows
  |   | - app-npm-dep-check.yml
```

## To Run

### Manual

The action can be run manually from the repository it is stored in.

Note: This will only work after the files have been pushed to the repo.

```
<Repo Page>
 -> Actions
 -> (Left Pane) NPM Dependency Reports
 -> Run Workflow
 -> (Optional) Set what branch you would like the script to run in
 -> Run Workflow
```

### Cron

The Action is also set to run as a [cron job](https://en.wikipedia.org/wiki/Cron) within the action itself.

Note: This was grabbed on November 5, 2024 the information may have been updated since.

```
on:
  schedule:
    - cron: '0 15 * * 2'
 #           | |  | | |
 #           | |  | | Tuesdays
 #           | |  | any month
 #           | |  any day
 #           | 15th hour (3PM UTC)
 #           0th minute
 # Tuesday morning at 7:00-8:00am Pacific Time.
```

## Env

Two variables are set as environment variables when the action is run. GITHUB_REPOSITORY is the repo itself, GITHUB_TOKEN is pulled from Github secrets and has authorization to make changes to the repo.

```
GITHUB_REPOSITORY: ${{ github.repository }}
GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Jobs

These are the steps that the workflow takes to accomplish the task.

### parse-json5-config

Steps:
1. Checkout repository & branch
2. Install json5 and os npm dependencies
3. Run `node .github/helpers/parse-json5-config .github/config/dep-report.json5`

Outputs:
- packageJsonPaths
- ignorePackages

### parse-package-versions

Needs:
- parse-json5-config to complete successfully

Env:
- packageJsonPaths from parse-json5-config
- ignorePackages from parse-json5-config

Steps:
1. Checkout repository & branch
2. Run `node .github/helpers/npm-deps/parse-npm-deps.cjs > outdatedDeps.json`
3. Upload `outdatedDeps.json` as an artifact

### write-output

Needs:
- parse-json5-config to complete successfully
- parse-package-versions to complete successfully

Env:
- packageJsonPaths from parse-json5-config

Steps:
1. Checkout repository & branch
2. Download `outdatedDeps.json` from parse-package-versions
3. Run `node .github/helpers/npm-deps/create-report.cjs > outputText.json`
4. Upload `outputText.json` as an artifact


### create-issues

Needs:
- parse-json5-config to complete successfully
- write-output to complete successfully

Env:
- packageJsonPaths from parse-json5-config

Steps:
1. Checkout repository & branch
2. Download `outputText.json` from write-output
3. Install @octokit/rest
4. Run `node .github/helpers/npm-deps/create-report-issues.cjs`

## Associated Scripts

### parse-json5-config

Path: `.github/helpers/parse-json5-config.js`

Requires:
  - fs
  - os
  - json5
  - argument config file

Steps:
1. Takes argument of config file
2. Reads config file setting each key value pair into Github environment variables

### config dep-report

Path: `.github/config/dep-report.json5`

Steps:
List of Env variables to set for scripts.
- packageJsonPaths: [] # sets paths to package.json files

### parse-npm-deps

Path: `.github/helpers/npm-deps/parse-npm-deps.cjs`

Requires:
  - https
  - path
  - packageJsonPaths from env

Steps:
1. LOCAL_TEST?
   - TRUE: Use locally defined path to packages
   - FALSE: Get path to packages from env variable
2. For each package.json path
   1. get list of dependencies
   2. get list of dev dependencies
   3. For both lists
      1. For each dependency in list
         1. Increment totals
         2. Get infomation packet from the dependency's npmjs latest version page
         3. If the latest version exists, isnt '0.0.0', and is different than the current version:
             - TRUE: If the latest version doesnt include '-':
                 - TRUE: saveDependencyResults()
                 - FALSE: Get newest version without '-' then saveDependencyResults()
                     - saveDependencyResults():
                     1. Determine if it is patch, minor, or major update
                     2. Set name, version, new version as an object and add to result struct
                 1. Increment counts
             - FALSE: go to next
3. Log results


### create-report

Path: `.github/helpers/npm-deps/create-report.cjs`

Requires:
  - path
  - outdatedDeps.json
  - packageJsonPaths from env

Steps:
1. LOCAL_TEST?
   - TRUE: Use locally defined path to packages
   - FALSE: Get path to packages from env variable
2. Set emoji, colour, and github markdown standards
3. Get date in format `<weekday>, <Month> <DD>, <YYYY>`
4. Set standard install command
5. Set standard list for detailed view
6. For dependency and dev dependency lists:
    1. Set title, subtitle, and messages
    2. Calculate percentages of up-to-date
    3. Set summary and reminder to set to correct folder
    4. Ensure all special characters are escaped
    5. Add to results
7. Log results

### github-api-requests

Path: `.github/helpers/github-api/github-api-requests.mjs`

Requires:
  - Octokit
  - GITHUB_TOKEN, GITHUB_REPOSITORY from env variables
  - GITHUB_REPOSITORY [OWNER, REPO]

Steps:
This essentially is the hub for github operations:
1. createIssue
2. closeIssue
3. findIssueByTitle

They all perform as their title suggests.

### create-and-close-existing-issue

Path: `.github/helpers/github-api/create-and-close-existing-issue.mjs`

Requires:
  - .github/helpers/github-api-requests.mjs

Steps:
1. Import createIssue, closeIssue, findIssueByTitle from `github-api-requests`
2. Find the existing issue
3. If it exists close it
4. Create a new issue with the title and body from create-report-issues

### create-report-issues

Path: `.github/helpers/npm-deps/create-report-issues.cjs`

Requires:
  - path
  - outputText.json

Steps:
1. Get package.json paths
2. Import `create-and-close-existing-issue`
3. For each package.json path
    1. Set issue title
    2. Send title and outputText block for current path to create-and-close-existing-issue
