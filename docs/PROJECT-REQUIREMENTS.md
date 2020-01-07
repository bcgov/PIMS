## User Stories
The [User Stories](./USER-STORIES.md) capture the system requirements

### Summary of Story Requirements 

Story requirements, listed in a table for easy viewing/organization:

| Requirement                                                                           | Story    | Done |
| ------------------------------------------------------------------------------------- | -------- | ---- |
| 3 personas; anonymous, administrator, regular                                         | Fcn Req  | Yes  |
| Anonymous only access to landing/sign-in page                                         | Fcn Req  | Yes  |
| Administrator users access to 'Main Map View' - see all users map points              | Fcn Req  | Yes  |
| Map should be interactive - zoom                                                      | Fcn Req  | Yes  |
| Create sign-in/landing page                                                           | 1        | Yes  |
| Sign-in button is labeled *Sign-in* instead of *Log-in*                               | 1        | Yes  |
| Signing-in redirects user to map view                                                 | 1        | Yes  |
| Create header for map view                                                            | 1        | Yes  |
| Create empty footer (i.e., no links) for map view                                     | 1        | Yes  |
| KeyCloak server configured with users and base parameters                             | 1        | Yes  |
| Interactive map with *mouse click and drag pan* functionality                         | 2        | Yes  |
| Interactive map with *mouse wheel zoom* functionality                                 | 2        | Yes  |
| On-click enabled within the map, adds a marker                                        | 3        | Yes  |
| Form to capture input for textual note (form to open on first click)                  | 3        | Yes  |
| BE: API endpoint to capture data consisting of: marker lat/long, user, textual note   | 3        | Yes  |
| BE: Store form data (marker lat/long, user, textual note) within db                   | 3        | Yes  |
| Get markers for current user from back-end                                            | 4        | Yes  |
| Draw markers on map                                                                   | 4        | Yes  |
| Add a click handler to each marker to show textual note                               | 4        | Yes  |
| BE: Get all places for current user                                                   | 4        | Yes  |
| BE: Get textual note for specific place                                               | 4        | Yes  |
| When existing marker clicked, open textual note in edit mode                          | 5        | Yes  |
| BE: API endpoint to update an existing place                                          | 5        | Yes  |
| BE: update DB with new textual note                                                   | 5        | Yes  |
| When marker selected, a delete icon/button is provided on textual note                | 6        | Yes  |
| When marker is deleted, a confirmation dialog/pop-up is displayed to user             | 6        | Yes  |
| Logic to submit delete marker request to back-end is implemented                      | 6        | Yes  |
| Refresh occurs after DB updated                                                       | 6        | Yes  |
| BE: API endpoint that deletes an existing place                                       | 6        | Yes  |
| BE: updated DB to remove place                                                        | 6        | Yes  |
| After Administrator logs in, initially only show Administrator's own markers (PO approved) | 7        | Yes  |
| Listing of all users, including Administrator's name, plus option for all users       | 7        | Yes  |
| As Administrator, select a single user (instead of multiple), and view user's markers (PO approved)     | 7        | Yes  |
| Show all users' markers                                                               | 7        | Yes  |
| BE: API endpoint to filter places by user                                             | 7        | Yes  |
| BE: API endpoint to list all users                                                    | 7        | Yes  |
| Ensure the backend code doesn't override the owner column of the place being edited   | 8        | Yes  |
| Ensure Administrator unable to place a new marker when "all users" is selected or when viewing a single user other than herself/himself   | 8        |  Yes  |
| Signing-out takes user to the Sign-in/Landing page                                    | 9        | Yes  |
| Sign-out button is labeled *Sign-out* instead of *Log-out*                            | 9        | Yes  |
| *Quick start* instructions for using *and* deploying app within README.md             | 10       | Yes  |
| Detailed document on how to build & deploy app within BUILD-AND-DEPLOY.md             | 10       | Yes  |
| Incorporate Apache 2.0 license within the project                                     | 10       | Yes  |
| Unit testing: API                                                                     | 11       | Yes  |
| Unit testing: Frontend                                                                | 11       | Yes  |


## Future Enhancements
- Reconfigure KeyCloak for this challenge
- Add helpful links to various governments site in the footer
- Add Apache 2 license snippet to top of each file
- Testing
  - SonarQube
  - Accessiblity scan (using Axe plugin?)
- Enable ability to select and delete multiple markers
- Enable ability to for Administrator to select multiple users' markers (currently single user or all users)
- Add ability to archive markers (currently they are deleted)
- Build deploy yaml scripts
