# RocketChat WebHook Integration

This integration is for GitHub Pull Requests.

Post to Channel: `#team-property-info-mgment`

Post as: `rocket.cat`

Alias: `GitHub`

Emoji: `:robot:`

Script

```js
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const getLabelsField = labels => {
  let labelsArray = [];
  labels.forEach(function(label) {
    labelsArray.push(label.name);
  });
  labelsArray = labelsArray.join(", ");
  return {
    title: "Labels",
    value: labelsArray,
    short: labelsArray.length <= 40
  };
};

const githubEvents = {
  ping(request) {
    return {
      content: {
        text:
          "_" +
          request.content.hook.id +
          "_\n" +
          ":thumbsup: " +
          request.content.zen
      }
    };
  },

  /* NEW OR MODIFY ISSUE */
  issues(request) {
    const user = request.content.sender;

    if (
      request.content.action == "opened" ||
      request.content.action == "reopened" ||
      request.content.action == "edited"
    ) {
      var body = request.content.issue.body;
    } else if (request.content.action == "labeled") {
      var body =
        "Current labels: " + getLabelsField(request.content.issue.labels).value;
    } else if (
      request.content.action == "assigned" ||
      request.content.action == "unassigned"
    ) {
      // Note that the issues API only gives you one assignee.
      var body = "Current assignee: " + request.content.issue.assignee.login;
    } else if (request.content.action == "closed") {
      if (request.content.issue.closed_by) {
        var body = "Closed by: " + request.content.issue.closed_by.login;
      } else {
        var body = "Closed.";
      }
    } else {
      return {
        error: {
          success: false,
          message: "Unsupported issue action"
        }
      };
    }

    const action = request.content.action.capitalizeFirstLetter();

    const text =
      "_" +
      request.content.repository.full_name +
      "_\n" +
      "**[" +
      action +
      " issue ​#" +
      request.content.issue.number +
      " - " +
      request.content.issue.title +
      "](" +
      request.content.issue.html_url +
      ")**\n\n" +
      body;

    return {
      content: {
        attachments: [
          {
            thumb_url: user.avatar_url,
            text: text,
            fields: []
          }
        ]
      }
    };
  },

  /* COMMENT ON EXISTING ISSUE */
  issue_comment(request) {
    const user = request.content.comment.user;

    if (request.content.action == "edited") {
      var action = "Edited comment ";
    } else {
      var action = "Comment ";
    }

    const text =
      "_" +
      request.content.repository.full_name +
      "_\n" +
      "**[" +
      action +
      " on issue ​#" +
      request.content.issue.number +
      " - " +
      request.content.issue.title +
      "](" +
      request.content.comment.html_url +
      ")**\n\n" +
      request.content.comment.body;

    return {
      content: {
        attachments: [
          {
            thumb_url: user.avatar_url,
            text: text,
            fields: []
          }
        ]
      }
    };
  },

  /* COMMENT ON COMMIT */
  commit_comment(request) {
    const user = request.content.comment.user;

    if (request.content.action == "edited") {
      var action = "Edited comment ";
    } else {
      var action = "Comment ";
    }

    const text =
      "_" +
      request.content.repository.full_name +
      "_\n" +
      "**[" +
      action +
      " on commit id " +
      request.content.comment.commit_id +
      " - " +
      +"](" +
      request.content.comment.html_url +
      ")**\n\n" +
      request.content.comment.body;

    return {
      content: {
        attachments: [
          {
            thumb_url: user.avatar_url,
            text: text,
            fields: []
          }
        ]
      }
    };
  },
  /* END OF COMMENT ON COMMIT */

  /* PUSH TO REPO */
  push(request) {
    var commits = request.content.commits;
    var multi_commit = "";
    var is_short = true;
    var changeset = "Changeset";
    if (commits.length > 1) {
      var multi_commit = " [Multiple Commits]";
      var is_short = false;
      var changeset = changeset + "s";
      var output = [];
    }
    const user = request.content.sender;

    var text =
      "**Pushed to " +
      "[" +
      request.content.repository.full_name +
      "](" +
      request.content.repository.url +
      "):" +
      request.content.ref.split("/").pop() +
      "**\n\n";

    for (var i = 0; i < commits.length; i++) {
      var commit = commits[i];
      var shortID = commit.id.substring(0, 7);
      var a = "[" + shortID + "](" + commit.url + ") - " + commit.message;
      if (commits.length > 1) {
        output.push(a);
      } else {
        var output = a;
      }
    }

    if (commits.length > 1) {
      text += output.reverse().join("\n");
    } else {
      text += output;
    }

    return {
      content: {
        attachments: [
          {
            thumb_url: user.avatar_url,
            text: text,
            fields: []
          }
        ]
      }
    };
  }, // End GitHub Push

  /* NEW PULL REQUEST */
  pull_request(request) {
    const user = request.content.sender;
    const attachment = {
      author_icon:
        "https://cloud.githubusercontent.com/assets/51996/13893698/c047133c-ed2e-11e5-9233-13622bcb9b7b.png",
      author_name:
        "#" +
        request.content.pull_request.number +
        " - " +
        request.content.pull_request.title,
      author_link: request.content.pull_request.html_url
    };

    // To disable some webhooks I've placed a _ at the beginning of the action.
    if (
      request.content.action == "opened" ||
      request.content.action == "reopened" ||
      request.content.action == "edited" ||
      request.content.action == "_synchronize" ||
      request.content.action == "_review_requested"
    ) {
      var body = request.content.pull_request.body;
    } else if (request.content.action == "_labeled") {
      var body =
        "Current labels: " +
        getLabelsField(request.content.pull_request.labels).value;
    } else if (
      request.content.action == "_assigned" ||
      request.content.action == "_unassigned"
    ) {
      // Note that the issues API only gives you one assignee.
      var body =
        "Current assignee: " + request.content.pull_request.assignee.login;
    } else if (request.content.action == "_closed") {
      if (request.content.pull_request.merged) {
        var body = "Merged by: " + request.content.pull_request.merged_by.login;
      } else {
        var body = "Closed.";
      }
    } else {
      return {
        error: {
          success: false,
          message: "Unsupported pull request action"
        }
      };
    }

    const action = request.content.action.capitalizeFirstLetter();

    let text =
      "Pull request [" +
      action +
      "] by **" +
      request.content.pull_request.user.login +
      "**\n\n";
    text += body;

    return {
      content: {
        alias: "GitHub",
        emoji: ":robot:",
        text: text,
        fields: [],
        attachments: [attachment]
      }
    };
  }
};

class Script {
  process_incoming_request({ request }) {
    const header = request.headers["x-github-event"];
    if (githubEvents[header]) {
      return githubEvents[header](request);
    }

    return {
      error: {
        success: false,
        message: "Unsupported method"
      }
    };
  }
}
```
