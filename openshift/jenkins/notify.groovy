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

  sh "curl -X POST -H 'Content-Type: application/json' --data \'${payload}\' ${rocketChatURL}"
}

def deploySuccess(appName, environment, changelog, vanity_url, rc_url) {
  rocketChatSend(
    rc_url,
    "New version of **${appName}**, build [${env.BUILD_DISPLAY_NAME}](${vanity_url}) in ${environment} 🚀 \n ${vanity_url}",
    "Changes:",
    changelog,
    "#1ee321",  // green
    "https://i.imgur.com/zHzPWXr.png"
  )
}

def deployFailure(appName, environment, error, vanity_url, rc_url) {
  rocketChatSend(
    rc_url,
    "@all Couldn't deploy **${appName}**, build [${env.BUILD_DISPLAY_NAME}](${vanity_url}) to ${environment} 🤕 \n ${env.BUILD_URL}",
    "Error:",
    error,
    "#e3211e",  // red
    "https://i.imgflip.com/1czxka.jpg"
  )
}

return this;
