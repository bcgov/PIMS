/**
 * This script takes from a JSON list of notifications and resends those notifications.
 * The only necessary property of the notification is the "id".
 * Get the token from your browser session. You must be an admin for this to work.
 * Drop the JSON file in this same folder and adjust the file name to use.
 */

import notifsToResend from './notif_ids_to_resend.json' with { type: "json" };

const token = "";

const targetUrl = "https://pims.gov.bc.ca/api/v2/notifications/queue"

notifsToResend.forEach(notif => {
  fetch(`${targetUrl}/${notif.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async (value: Response) => {
    if (value.status == 200){
      console.log(notif.id, "Success")
    } else {
      console.log(notif.id, value.status, await value.text())
    }
  }).catch((reason: any) => {
    console.log(notif.id, reason)
  })
})
