# Testing

There are four types of testing currently implemented;

1. Frontend Unit Tests (React)
2. Backend Unit Tests (.net core)
3. User Test Plans (function testing)
4. Postman

## Frontend Unit Tests

Open a terminal window at the root of the solution and execute the following command;

- `cd ./scripts/test-app.sh`

## Backend Unit Tests

Open a terminal window and execute the following command;

- `cd ./scripts/test-api.sh`

## User Testing Plan

### Test Case #1 - Regular User, Basic Functionality

(Tests stories 1-6, & 9, as a regular user)

1. Sign-in as a regular user
1. Pan map
1. Zoom in and out of map
1. Add new markers
1. Delete markers
1. Edit textual notes associated with markers
1. Sign-out
1. Sign-in again and confirm that changes from last session persisted
1. Sign-out

### Test Case #2 - Administrator, Ensure Same Basic Functionality as Regular User

(Tests stories 1-6, & 9, as an Administrator)

1. Sign-in as an administrator
1. Pan map
1. Zoom in and out of map
1. Add new markers
1. Delete markers
1. Edit textual notes associated with markers
1. Sign-out
1. Sign-in again and confirm that changes from last session persisted
1. Sign-out

### Test Case #3 - Administrator, Basic Administrator Functionality

(Tests stories 1, 7, & 9, as an Administrator)

**Prior set-up**:

- regular user **'A'** has 3 markers already in place, each with textual notes
- regular user **'B'** has 2 markers already in place, each with textual notes
- regular user **'C'** has 1 marker
- regular user **'D'** has no markers
- administrator has 1 marker already in place, with a textual note

**Testing steps**:

1. Sign-in as an administrator
1. Select user **'A'** from the dropdown list in the header
1. Select a couple different markers, read their textual notes
1. Select user **'B'** from the dropdown list in the header
1. **Select a point on the map with no marker, and ensure no marker is placed**
1. Select a couple different markers, read their textual notes
1. Select user **'D'** from the dropdown list in the header (and ensure no markers are displayed)
1. Select all users from the dropdown list in the header
1. Select a couple different markers, read their textual notes
1. Sign-out

### Test Case #4 - Regular User, Advanced Functionality

(Tests stories 1, 3-6, & 9, as a regular user)

**Prior set-up**: the regular user has 3 markers already in place, each with textual notes

1. Sign-in as a regular user
1. Add 2 new markers
1. Delete 1 pre-existing marker
1. Edit textual note associated with 1 pre-existing marker
1. Sign-out
1. Sign-in again and confirm that changes from last session persisted
1. Sign-out
1. Sign-in as a different user
1. Confirm that none of the first user's markers are displayed
1. Sign-out

### Test Case #5 - Administrator, Advanced Functionality

(Tests stories 1, 7, 8, & 9, as an Administrator; stories 1, 4, & 9, as a regular user)

**Prior set-up**:

- regular user **'A'** has 3 markers already in place, each with textual notes
- regular user **'B'** has 2 markers already in place, each with textual notes
- regular user **'C'** has 1 marker
- regular user **'D'** has no markers
- administrator has 1 marker already in place, with a textual note

**Testing steps**:

1. Sign-in as an administrator
1. Select user **'A'** from the dropdown list in the header
1. Select two different markers, and edit them, appending "Administrator edited this" in the note
1. Select user **'B'** from the dropdown list in the header
1. Select one of the markers and delete it
1. Select all users from the dropdown list in the header
1. Select a couple different markers, read their textual notes
1. Sign-out
1. Sign-in as regular user **'A'** and confirm
   1. appropriate markers still exist
   1. the two markers with updated textual notes have been updated accordingly
1. Sign-out
1. Sign-in as regular user **'B'** and confirm
   1. only one marker is left and its textual note remained unchanged
1. Sign-out
1. Sign-in as regular user **'D'** and confirm no changes have been made (i.e., there are still no markers)
1. Sign-out

## Postman

We used Postman to test the API endpoints.

View the Postman configuration file [here](../test/Postman/test-api.json)
