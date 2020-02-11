class Script {
  prepare_outgoing_request({ request }) {
    let match;

    //        console.log('lastCmd', Store.get('lastCmd'));

    //        match = request.data.text.match(/^pr last$/);
    //        if (match && Store.get('lastCmd')) {
    //            request.data.text = Store.get('lastCmd');
    //        }

    console.log(request.data.text);
    match = request.data.text.match(
      /^\/github pr\s(ls|list)\s*(open|closed|all)?$/
    );
    if (match) {
      Store.set("lastCmd", request.data.text);
      let u = request.url + "/pulls";
      if (match[2]) {
        u += "?state=" + match[2];
      }
      return {
        url: u,
        headers: request.headers,
        method: "GET"
      };
    }

    match = request.data.text.match(/^\/github( help)?$/);
    if (match) {
      Store.set("lastCmd", request.data.text);
      return {
        message: {
          text: [
            "**GitHub commands**",
            "```",
            "  github help                          Show this help",
            "  github pr ls|list [open|closed|all]  List Pull Requests",
            "```"
          ].join("\n")
        }
      };
    }
  }

  process_outgoing_response({ request, response }) {
    var text = [];
    console.log(response.content);
    response.content.forEach(function(pr) {
      text.push(
        "> " +
          pr.state +
          " [#" +
          pr.number +
          "](" +
          pr.html_url +
          ") - " +
          pr.title
      );
    });

    return {
      content: {
        text: text.join("\n"),
        parseUrls: false
      }
    };
  }
}
