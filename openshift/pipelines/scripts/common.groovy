import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import java.util.regex.Pattern

def version = "1.0"

// ---------------
// Pipeline Stages
// ---------------

// Run Tests
def runFrontendTests() {
  timeout(20) {
    dir('frontend') {
      echo 'Installing NPM Dependencies...'
      sh 'npm ci'
      echo 'Reporting Vulnerable Dependencies...'
      sh 'npm audit || true'
      echo "Linting and Testing Frontend..."
      sh 'npm run lint'
      sh 'npm run coverage'
    }
  }
}

def runFrontendStaticAnalysis(String sonarUrl, String jobName) {
  timeout(20) {
    dir('frontend') {
      echo 'Performing SonarQube static code analysis...'
      sh """
      sonar-scanner \
        -Dsonar.host.url='${sonarUrl}' \
        -Dsonar.projectKey='pims-frontend-${jobName}' \
        -Dsonar.projectName='PIMS Frontend [${jobName.toUpperCase()}]'
      """
    }
  }
}

// For future reference, if we have N test projects the flow of events would be:
//
// **Pre-conditions:**
//  - All projects export their individual coverage percents in JSON and OpenCover format
//  - There's no way to merge OpenCover xmls together (that I could find)
//  - Common folder "../TestResults" is  git ignored so nothing gets in source control
//
// **Steps:**
//
// Test-project 1
//   - generate coverage files (without merging)
//   - copy results to common folder "../TestResults"
// Test-project 2
//   - generate coverage files merging with previous `coverage.json`
//   - the previous `coverage.opencoverage.xml` is ignored
//   - copy results to common folder "../TestResults"
//  ...
// Test-project N
//   - generate coverage files merging with previous `coverage.json`
//   - the previous `coverage.opencoverage.xml` is ignored
//   - copy results to common folder "../TestResults"
//
// The final `coverage.opencover.xml` is the one we want
def runBackendTests() {
  // pull code
  checkout scm
  timeout(20) {
    dir('backend') {
      sh 'dotnet --version'
      sh 'node --version'

      echo 'Install dependencies...'
      sh 'dotnet restore'

      echo 'Build'
      sh 'dotnet build --configuration Release --no-restore'
    }
    dir('backend/tests/unit') {
      sh 'mkdir -p TestResults'
      sh 'rm -rf api/TestResults'
      sh 'rm -rf dal/TestResults'
      dir('api') {
        sh 'dotnet test -m:1 --collect:"XPlat Code Coverage" --settings coverlet.runsettings --no-restore'
        sh 'mv TestResults/*/* ../TestResults/'
      }
      dir('dal') {
        sh 'dotnet test -m:1 --collect:"XPlat Code Coverage" --settings coverlet.runsettings --no-restore'
        sh 'mv TestResults/*/* ../TestResults/'
      }
    }
  }
}

def maintenancePageOn(envName) {
  dir('maintenance') {
    sh "./maintenance.sh ${envName} on"
  }
}

def maintenancePageOff(envName) {
  dir('maintenance') {
    sh "./maintenance.sh ${envName} off"
  }
}


// ------------------
// Git Functions
// ------------------

// Determine whether there were any changes the files within the project's context directory.
@NonCPS
boolean hasDirectoryChanged(String contextDirectory) {
  // Determine if code has changed within the source context directory.
  def changeLogSets = currentBuild.changeSets
  def filesChangeCnt = 0
  for (int i = 0; i < changeLogSets.size(); i++) {
    def entries = changeLogSets[i].items
    for (int j = 0; j < entries.length; j++) {
      def entry = entries[j]
      def files = new ArrayList(entry.affectedFiles)
      for (int k = 0; k < files.size(); k++) {
        def file = files[k]
        def filePath = file.path
        if (filePath.contains(contextDirectory)) {
          filesChangeCnt = 1
          k = files.size()
          j = entries.length
        }
      }
    }
  }

  if ( filesChangeCnt < 1 ) {
    echo('The changes do not require a build.')
    return false
  }
  else {
    echo('The changes require a build.')
    return true
  }
}

/*
 * Generates a string containing all the commit messages from
 * the builds in pastBuilds.
 */
String getChangeLog() {
  MAX_MSG_LEN = 512
  def changeString = ""
  def changeLogSets = currentBuild.changeSets
  for (int i = 0; i < changeLogSets.size(); i++) {
    def entries = changeLogSets[i].items
    for (int j = 0; j < entries.length; j++) {
      def entry = entries[j]
      truncated_msg = entry.msg.take(MAX_MSG_LEN)
      changeString += " - ${truncated_msg} [${entry.author}]\n"
    }
  }
  if (!changeString) {
     changeString = "No changes"
  }
  return changeString
}

// ------------------
// Openshift Functions
// ------------------

// Get an image's hash tag
String getImageTagHash(String imageName, String tag = "") {
  if(!tag?.trim()) {
    tag = "latest"
  }
  def istag = openshift.raw("get istag ${imageName}:${tag} -o template --template='{{.image.dockerImageReference}}'")
  return istag.out.tokenize('@')[1].trim()
}

// Build the objects that are found by the filter.
def build(buildconfigs, int waitTimeout) {
  echo "Build in script"
  // Find all of the build configurations associated to the application ...
  echo "Found ${buildconfigs.count()} buildconfigs: ${buildconfigs.names()}"

  // Kick off all the builds in parallel ...
  def builds = buildconfigs.startBuild()
  echo "Started ${builds.count()} builds: ${builds.names()}"

  timeout(waitTimeout) {
    // Wait for all the builds to complete ...
    // This section will exit after the last build completes.
    echo "Waiting for builds to complete ..."
    builds.withEach {
      // untilEach and watch - do not support watching multiple named resources,
      // so we have to feed it one at a time.
      it.untilEach(1) {
        echo "${it.object().status.phase} - ${it.name()}"
        return (it.object().status.phase == "Complete")
      }
    }
  }

  echo "Builds complete ..."
}

// Abort the specified build.
@NonCPS
private void abortBuild(build) {
  boolean aborted=false;
  if (build instanceof org.jenkinsci.plugins.workflow.job.WorkflowRun) {
    int counter=0
    while (counter<60 && build.isInProgress()) {
      for (org.jenkinsci.plugins.workflow.support.steps.input.InputAction inputAction:build.getActions(org.jenkinsci.plugins.workflow.support.steps.input.InputAction.class)){
        for (org.jenkinsci.plugins.workflow.support.steps.input.InputStepExecution inputStep:inputAction.getExecutions()) {
          if (!inputStep.isSettled()) {
            inputStep.doAbort()
          }
        }
      }

      counter++
      Thread.sleep(1000) //milliseconds
    }
  }

  if (build.isInProgress()) {
    build.doKill()
  }
}

// Abort all previous builds in progress for the specified build.
def abortAllPreviousBuildsInProgress(currentBuild) {
  while(currentBuild.rawBuild.getPreviousBuildInProgress() != null) {
    abortBuild(currentBuild.rawBuild.getPreviousBuildInProgress())
  }
}

// --------------------
// Supporting Functions
// --------------------

return this;
