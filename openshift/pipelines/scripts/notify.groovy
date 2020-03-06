import groovy.json.JsonOutput
import java.util.regex.Pattern

def version = "1.0"

// ------------------
// Notifications
// ------------------

/*
 * Sends a rocket chat notification
 */
def rocketChatSend(url, text, summary, description, color, image_url = "") {
  def rocketChatURL = url
  def message = text
  def payload = JsonOutput.toJson([
    username: "Jenkins",
    icon_url: "https://wiki.jenkins.io/download/attachments/2916393/headshot.png",
    text: message,
    attachments: [
      [
        title: summary,
        text: description,
        image_url: image_url,
        color: color
      ]
    ]
  ])

  writeFile(file: "post.json", text: payload)
  sh "curl -X POST -H 'Content-Type: application/json' --data @post.json ${rocketChatURL}"
}

def deploySuccess(appName, environment, changelog, vanity_url, rc_url) {
  rocketChatSend(
    rc_url,
    "New version of **${appName}**, build [${env.BUILD_DISPLAY_NAME}](${env.BUILD_URL}) in ${environment} 🚀 \n ${vanity_url}",
    "Changes:",
    changelog,
    "#1ee321",  // green
    "https://i.imgur.com/zHzPWXr.png"
  )
}

def deployFailure(appName, environment, error_msg, vanity_url, rc_url) {
  rocketChatSend(
    rc_url,
    "@all Could not deploy **${appName}**, build [${env.BUILD_DISPLAY_NAME}](${env.BUILD_URL}) to ${environment} 🤕",
    "${appName} Deployment",
    error_msg,
    "#e3211e",  // red
    "https://i.imgflip.com/1czxka.jpg"
  )
}

def noChanges(appName, environment, rc_url) {
  rocketChatSend(
    rc_url,
    "@all The CI/CD pipeline ran but no changes were detected for **${appName}**. \n Build [${env.BUILD_DISPLAY_NAME}](${env.BUILD_URL}) was **NOT** deployed to ${environment} 🤕",
    "${appName} Deployment",
    "",
    "#e3211e",  // red
    "https://i.imgflip.com/3pos4b.jpg"
  )
}

return this;
