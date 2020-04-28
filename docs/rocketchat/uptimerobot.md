# RocketChat WebHook Integration

This integration is for UptimeRobot.

Post to Channel: `#pims-cicd`

Post as: `rocket.cat`

Alias: `UptimeRobot`

Emoji: `:robot:`

Script

```js
const uptimeParams = {
  monitorID: 'monitorID',
  monitorURL: 'monitorURL',
  monitorFriendlyName: 'monitorFriendlyName',
  alertType: 'alertType',
  alertTypeFriendlyName: 'alertTypeFriendlyName',
  alertDetails: 'alertDetails',
  alertDuration: 'alertDuration',
  monitorAlertContacts: 'monitorAlertContacts',
};

const uptimeRobotUrl = 'https://stats.uptimerobot.com/M7nQzH52nW';

function getAttachment(request) {
  return {
    author_icon:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Shutdown_button.svg/1024px-Shutdown_button.svg.png',
    author_name:
      '#' +
      request.url.query[uptimeParams.monitorID] +
      ' - ' +
      request.url.query[uptimeParams.monitorFriendlyName],
    author_link: uptimeRobotUrl
  };
}

const uptimeEvents = {
  Up(request) {
    const text = request.url.query[uptimeParams.monitorURL] + '\n\n' + request.url.query[uptimeParams.alertDetails];

    return {
      content: {
        alias: 'UptimeRobot',
        emoji: ':white_check_mark:',
        text: text,
        fields: [],
        attachments: [getAttachment(request)]
      }
    };
  },
  Down(request) {
    const text = request.url.query[uptimeParams.monitorURL] + '\n\n' + request.url.query[uptimeParams.alertDetails];

    return {
      content: {
        alias: 'UptimeRobot',
        emoji: ':boom:',
        text: text,
        fields: [],
        attachments: [getAttachment(request)]
      }
    };
  }
};

class Script {
  process_incoming_request({ request }) {
    const alert = request.url.query[uptimeParams.alertTypeFriendlyName];
    if (uptimeEvents[alert]) {
      return uptimeEvents[alert](request);
    }

    return {
      error: {
        success: false,
        message: 'Unsupported method' + alert
      }
    };
  }
}
```
