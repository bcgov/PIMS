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
  |   |   | - update-issue-and-comment.mjs
  |   |   | - github-api-requiests.mjs
  |   | - npm-deps
  |   |   | - create-report-issues.cjs
  |   |   | - create-report.cjs
  |   |   | - parse-npm-deps.cjs
  |   |   | - parse_to_comment.py
  |   |   | - README.md  <------------------ you are here
  | - workflows
  |   | - app-npm-dep-check.yml
```

## Overview

In plain text (if you want a more detailed explanation see below) this workflow does the following:

1. Run `.github/helpers/parse-json5-config` on `.github/config/dep-report.json5`
    - This produces `packageJsonPaths` (currently the only config item)
2. Run `.github/helpers/npm-deps/parse-npm-deps.cjs`
    - This goes through `packageJsonPaths` and gets the lists of dependencies for each path listed
    - Checks if there is a newer version from their npm page
    - Create json structure of updates that need to be processed
    - write output to `outdatedDeps.json`
3. Run `.github/helpers/npm-deps/parse_to_comment.py`
    - This takes in `outdatedDeps.json`
    - Creates strings of info for each update that is listed
        - Ignores any packages in ignore list (adds to warning list)
        - Ignores any package updates for levels not being reported on
    - Puts all the update strings together, and any warnings or errors into one string to rule them all
    - Saves that string to GITHUB_OUTPUT env file as `commentContents`=oneString
4. Run `.github/helpers/npm-deps/create-report.cjs`
    - This builds the issue body from `outdatedDeps.json`
    - Formats as md file
    - Write output to `outputText.json`
5. Run `.github/helpers/npm-deps/create-report-issues.cjs`
    - This takes in
        - `packageJsonPaths`
        - `commentContents`
        - `outputText.json`
    - For each path in `packageJsonPaths`:
        - Title = current_path + NPM Dependency Report
        - Closes any old Github Issues matching Title
        - Creates a new Github Issue with same Title and body from `outputText.json`
        - Comments on that issue with `commentContents`
        - *This comment triggers the webhook to run*
        - Closes comment it just created

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

## Workflow Jobs

These are the steps that the workflow takes to accomplish the task.

### parse-json5-config

Steps:
1. Checkout repository & branch
2. Install json5 and os npm dependencies
3. Run `node .github/helpers/parse-json5-config .github/config/dep-report.json5`

Outputs:
- packageJsonPaths

### parse-package-versions

Needs:
- parse-json5-config to complete successfully

Env:
- packageJsonPaths from parse-json5-config

Steps:
1. Checkout repository & branch
2. Run `node .github/helpers/npm-deps/parse-npm-deps.cjs > outdatedDeps.json`
3. Upload `outdatedDeps.json` as an artifact

### create-comment-text

Needs:
- parse-json5-config to complete successfully
- parse-package-versions to complete successfully

Env:
- packageJsonPaths from parse-json5-config

Steps:
1. Download output `<outdatedDeps>` from parse-package-versions
2. Encode `<outdatedDeps>` to Github standards
3. Checkout repository & branch
4. Setup Python environment
5. Run `python3 .github/helpers/npm-deps/parse_to_comment.py`

Outputs:
- commentContents

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
- create-comment-text to complete successfully
- write-output to complete successfully

Env:
- packageJsonPaths from parse-json5-config
- commentContents from create-comment-text

Steps:
1. Checkout repository & branch
2. Download `outputText.json` from write-output
3. Install [@octokit/rest](https://octokit.github.io/rest.js/v21/)
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

### parse_to_comment

Path: `.github/helpers/npm-deps/parse_to_comment.py`

Requires:
  - os          - Python lib for interacting with files
  - json        - json string -> dict -> json string
  - datetime    - timestamp for errors and warngings
  - env variable DEP_INPUT (output from parse-package-versions)

Steps:
1. Get env variables
2. Create update dictionary
3. For each folder listed in DEP_INPUT
   1. Combine dev dependencies and regular dependencies
   2. For each dep level we are reporting on.
      1. Make a command to update all at once
         - ex: `"npm install dep1@<new_version>, ..., depN@<new_version>"`
      2. make a list of all updates in readable format
         - ex: `"Update dep1 from <old_version> to <new_version>
            ...
            Update depN from <old_version> to <new_version>"`
      3. If there are updates to report on:
         - Yes: Create header string: `"There are a total of <total_updates> updates for <folder>\n"`
         - No: Create header string: `"Currently there are no updates for <folder>\n"`
      4. For each dependency level we are reporting on & has updates create an update string:
         - ex: `" There are <count> <level> updates.
            To update run the following:
            <string to update all level deps>
            List of updates:
            <list of level updates> "`
      5. Add header string to list
      6. Add update strings to list
   3. If we hit any Errors add them to the list
   4. If we hit any Warnings add them to the list
   5. join the list together as one string, separating each line with a newline character.
   6. Add {folder: list} to update dictionary
4. Transform update dictionary to json string (update_str)
5. Print update_str to log
6. Write update_str to GITHUB_OUTPUT file as commentContents=update_str
7. Log end of script.

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
  - [Octokit](https://octokit.github.io/rest.js/v21/)
  - GITHUB_TOKEN, GITHUB_REPOSITORY from env variables
  - GITHUB_REPOSITORY [OWNER, REPO]

Steps:
This essentially is the hub for github operations:
1. createIssue
2. closeIssue
3. addComment
4. deleteComment
3. findIssues

They all perform as their title suggests. See the [Github](https://docs.github.com/en/rest), or [Octokit.resr.js](https://octokit.github.io/rest.js/v21/) documentation for more information.

### update-issue-and-comment

Path: `.github/helpers/github-api/update-issue-and-comment.mjs`

Requires:
  - .github/helpers/github-api-requests.mjs

Steps:
1. Import createIssue, closeIssue, addComment, deleteComment, findIssues from `github-api-requests`
2. Set up status code object for better error logging
- *Steps for closeAndCreateIssue*
3. Get a list of issues (`findIssues`)
    - Note: these include PRs
    1. If we get anything but sucess code return whatever we got back.
    2. Loop through issues we got and try to match title to what we are trying to create
        - If we find a match return the number of that issue
        - If we dont find a match return null
4. If we got a number close the issue (`closeIssue`)
5. If we didnt get a number or null return whatever we got.
6. Request to create a new issue (`createIssue`)
7. Check the status of the new issue
    1. If it wasnt successfull return information on what we got back
8. Set 2 second timeout to let the issue be processed before continuing
    - There is a very good chance that these timeouts aren't doing anything...
9. Get number associated to issue just created.
- *closeAndCreateIssue end*
10. Check that we have a number
    - If not return whatever we got as an error
- *Steps for createAndCloseComment*
11. Try to create a new comment on the issue we just created (`createComment`)
    - This comment will trigger the webhook to send
12. Check the status of this
    - If it is anything other than success return whatever we got back
13. Set 2 second timeout to let the comment be processed before continuing
    - There is a very good chance that these timeouts aren't doing anything...
14. Get the comment ID of the comment we just made
15. try deleting the comment (`deleteComment`)
    - If we get anything but success send what we got back as an error.
16. return success code.
- *createAndCloseComment end*
17. If we didnt get a number back we hit an error somewherer return whatever was passed out.

### create-report-issues

Path: `.github/helpers/npm-deps/create-report-issues.cjs`

Requires:
  - path
  - outputText.json

Steps:
1. Get package.json paths
2. Import `update-issue-and-comment`
3. For each package.json path
    1. Set issue title
    2. Set issue comment
    3. Send title, comment, and outputText block for current path to create-and-close-existing-issue

