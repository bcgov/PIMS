// The name of the "stash" containing the ZAP report
// def ZAP_REPORT_STASH = "zap-report"

// --------------------
// Declarative Pipeline
// --------------------
pipeline {
  agent any
  options {
    disableResume()
    buildDiscarder(logRotator(numToKeepStr: "5")) // keep 5 builds only
  }
  environment {
    CI = "true"
    // SonarQube configuration
    SONARQUBE_URL_INT = "http://sonarqube:9000"

    // Environment Variables that should be set in OpenShift
    // -----------------------------------------------------
    // The job identifier (i.e 'pr-5' OR 'dev' OR 'master')
    // OC_JOB_NAME = "dev"
    OC_JOB_NAME = sh(script: 'echo "${OC_JOB_NAME:-dev}"', returnStdout: true).trim()
  }
  stages {
    stage('OWASP Scan') {
      agent { label 'owasp-zap' }
      steps {
        // The ZAP scripts are installed on the root of the jenkins-slave-zap image.
        // When running ZAP from there the reports will be created in /zap/wrk/ by default.
        // ZAP has problems with creating the reports directly in the Jenkins
        // working directory, so they have to be copied over after the fact.
        sh '''
          mkdir -p zap-output
          /zap/zap-baseline.py -x zap-report.xml -t https://pims-dev.pathfinder.gov.bc.ca || return_code=$?
          echo "Exit value was - " $return_code
          cp /zap/wrk/zap-report.xml ./zap-output/
        '''
      }
      post {
        always {
          stash name: "zap", includes: "zap-output/*"
        }
      }
    }

    stage('Publish to SonarQube') {
      agent { label 'jenkins-slave-npm' }
      steps {
        echo "Preparing the report for the publishing ..."
        unstash name: "zap"

        sh "ls -al ${pwd()}/zap-output"

        echo "Publishing the report ..."

        // 'sonar.zaproxy.reportPath' must be set to the absolute path of the xml formatted ZAP report.
        // Exclude the report from being scanned as an xml file.  We only care about the results of the ZAP scan.
        sh """
          sonar-scanner \
            -Dsonar.verbose=true \
            -Dsonar.host.url='${SONARQUBE_URL_INT}' \
            -Dsonar.projectKey='pims-zap-${OC_JOB_NAME}' \
            -Dsonar.projectName='PIMS ZAP [${OC_JOB_NAME}]' \
            -Dsonar.sources=zap-output/ \
            -Dsonar.zaproxy.reportPath=${WORKSPACE}/zap-output/zap-report.xml \
            -Dsonar.exclusions=**/*.xml
        """
      }
    }
  }
}




// //See https://github.com/jenkinsci/kubernetes-plugin
// podTemplate(label: 'owasp-zap', name: 'owasp-zap', serviceAccount: 'jenkins', cloud: 'openshift', containers: [
//   containerTemplate(
//     name: 'jnlp',
//     image: '172.50.0.2:5000/openshift/jenkins-slave-zap',
//     resourceRequestCpu: '500m',
//     resourceLimitCpu: '1000m',
//     resourceRequestMemory: '3Gi',
//     resourceLimitMemory: '4Gi',
//     workingDir: '/tmp',
//     command: '',
//     args: '${computer.jnlpmac} ${computer.name}'
//   )
// ]) {
//   node('owasp-zap') {
//     stage('ZAP Security Scan') {
//       // dir('/zap') {
//       //   def retVal = sh returnStatus: true, script: '/zap/zap-baseline.py -r baseline.html -t https://pims-dev.pathfinder.gov.bc.ca/'
//       //   publishHTML(target: [allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: '/zap/wrk', reportFiles: 'baseline.html', reportName: 'ZAP Baseline Scan', reportTitles: 'ZAP Baseline Scan'])
//       //   echo "Return value is: ${retVal}"
//       // }

//       dir('.zap-scan') {
//         // The ZAP scripts are installed on the root of the jenkins-slave-zap image.
//         // When running ZAP from there the reports will be created in /zap/wrk/ by default.
//         // ZAP has problems with creating the reports directly in the Jenkins
//         // working directory, so they have to be copied over after the fact.
//         def retVal = sh (
//           returnStatus: true,
//           script: "/zap/zap-baseline.py -x zap-report.xml -t https://pims-dev.pathfinder.gov.bc.ca/"
//           // Other scanner options ...
//           // zap-api-scan errors out
//           // script: "/zap/zap-api-scan.py -x ${ZAP_REPORT_NAME} -t ${API_TARGET_URL} -f ${API_FORMAT}"
//           // script: "/zap/zap-full-scan.py -x ${ZAP_REPORT_NAME} -t ${TARGET_URL}"
//         )
//         echo "Return value is: ${retVal}"

//         // Copy the ZAP report into the Jenkins working directory so the Jenkins tools can access it.
//         sh "cp /zap/wrk/zap-report.xml ."
//       }

//       // Stash the ZAP report for publishing in a different stage (which will run on a different pod).
//       echo "Stash the report for the publishing stage ..."
//       stash name: "zap-report", includes: ".zap-scan/*.xml"
//     }
//   }
// }

// node('jenkins-slave-npm') {
//   stage('Publish ZAP Report to SonarQube') {
//     echo "Preparing the report for the publishing ..."
//     unstash name: "zap-report"
//     sh "ls -al"

//     echo "Publishing the report ..."
//     def SONAR_URL_INT = "http://sonarqube:9000"
//     def TARGET = "dev"

//     // 'sonar.zaproxy.reportPath' must be set to the absolute path of the xml formatted ZAP report.
//     // Exclude the report from being scanned as an xml file.  We only care about the results of the ZAP scan.
//     sh """
//       sonar-scanner \
//         -Dsonar.verbose=true \
//         -Dsonar.host.url='${SONAR_URL_INT}' \
//         -Dsonar.projectKey='pims-zap-${TARGET}' \
//         -Dsonar.projectName='PIMS ZAP [${TARGET}]' \
//         -Dsonar.sources=.zap-scan \
//         -Dsonar.zaproxy.reportPath=${WORKSPACE}/.zap-scan/zap-report.xml \
//         -Dsonar.exclusions=**/*.xml
//     """
//   }
// }
