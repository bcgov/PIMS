import groovy.json.JsonOutput
import java.util.regex.Pattern

def version = "1.0"

// ------------------
// Notifications
// ------------------

def success(appName, version, environment, rc_url = "") {
  rocketChatSend(
    rc_url,
    "${appName}, release: [${version}] was deployed to **${environment}** 🚀",
    "#1ee321",  // green
    "https://i.imgur.com/zHzPWXr.png"
  )
}

def failure(appName, version, environment, rc_url = "") {
  rocketChatSend(
    rc_url,
    "Could not deploy ${appName}, release: [${version}] to **${environment}** 🤕",
    "#e3211e",  // red
    "https://i.imgflip.com/1czxka.jpg"
  )
}

/*
 * Sends a rocket chat notification
 */
def rocketChatSend(rc_url, text, color, image_url = "") {
  if (rc_url != "") {
    def message = text
    def payload = JsonOutput.toJson([
      username: "Jenkins",
      icon_url: "https://wiki.jenkins.io/download/attachments/2916393/headshot.png",
      text: message,
      attachments: [
        [
          image_url: image_url,
          color: color
        ]
      ]
    ])

    writeFile(file: "post.json", text: payload)
    sh "curl -X POST -H 'Content-Type: application/json' --data @post.json ${rc_url}"
  } else {
    echo text
  }
}

return this;
