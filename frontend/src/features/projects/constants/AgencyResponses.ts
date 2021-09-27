export enum AgencyResponses {
  // Agency does not want to receive notifications.
  Unsubscribe = 'Unsubscribe',
  // Agency wants to receive notifications.
  Subscribe = 'Subscribe',
  // Agency does not want to receive notifications, but is interested in watching the project.
  Watch = 'Watch',
}
