# User Stories

## User Story #1
Sign in to the application as a regular user or administrator

**Given** that I'm an anonymous user  
**And** I’m in the Landing / Sign-in page  
**When** I click the Sign-in button  
**Then** I am prompted to enter my credentials (via some identity provider)
**And** I am taken to the Main Map View for the application
**And** In the application header, my username is displayed

*Note: It is up to you how to handle authentication - i.e. OAuth, Identity Provider, or email/password solutions are all acceptable.  User profile creation is not a requirement for this challenge, this is just a means of authenticating and identifying returning users*

**Team Notes**
- `Default Home Page`
- After login redirect to `Main Map View`

## User Story #2
As a regular user or administrator, I should be able to interact with the web map

**Given** that I'm a regular user or an administrator
**And** I am on the Main Map view      
**When** I click and drag on the map
**Then** The map is panned
**And When**  I use my mouse wheel
**Then** The map is zoomed

**Team Notes**
- `Main Map View`
- Display map
  - Drag and click events
  - Zoom with mouse

## User Story #3
As a regular user or administrator, I should be able to add a "Place I've Visited" to the web map

**Given** that I'm a regular user or an administrator      
**And** I am on the Main Map view   
**When** I click on a location that does not already have a marker/pin  
**Then** a marker/pin is dropped on the location I clicked
**And** I am prompted to enter a textual note that is associated with that location
**And** When I save my note, the location and note are both persisted to the database

**Team Notes**
- `Main Map View`
- on-click event on map
  - Display `Place I've Visited` form
    - Lat/Long
    - Note
    - Add/Update/Delete
  - CRUD - API `/api/places/{id}`
    - Must associate with user
    - Save to db
    
## User Story #4
As a regular user, I should be able to view all of my "Places I've Visited" location markers on the web map

**Given** that I'm a regular user 
**And** I am on the Main Map view
**Then** I can see markers for all previous location markers that I have created    
**And** If I click on an individual marker
**Then** I can view the textual note associated with that marker

**Team Notes**
- GET - API `/api/my/places`
- `Main Map View`
  - Draw pins on map
  - on-click event on pins
    - Display `Place I've Visited` form
    - GET - API `/api/places/{id}`
    
## User Story #5
As a regular user, I should be able to edit the textual note associated with a location marker previously created

**Given** that I'm a regular user
**And** I am on the Main Map view
**When** I select a marker for one of my created locations
**Then** I am given the option to edit the textual note associated with that marker and persist my edits to the database     

**Team Notes**
- `Main Map View`
  - on-click event on pins
    - Display `Place I've Visited` form
    - Edit ability
    - GET - API `/api/places/{id}`
    - PUT - API `/api/places/{id}`
    
## User Story #6
As a regular user, I should be able to delete a previous created location marker that I have created

**Given** that I'm a regular user
**And** I am an on the Main Map view
**When** I select a marker for one my created location 
**Then** I am given the option to remove that marker from the map
**And** when I confirm that I want to remove the marker, it is deleted/archived in the database
**And** It is no longer visible on the Main Map view

**Team Notes**
- `Main Map View`
  - on-click event on pins
    - Display `Place I've Visited` form
    - Edit ability
    - GET - API `/api/places/{id}`
    - DELETE - API `/api/places/{id}`
      - Archive vs delete
    - Confirmation dialog
    - Update map to remove pin
    
## User Story #7
As an administrator, I should be able view markers for all users and filter the visible markers by user

**Given** that I'm an administrator
**And** I am on the Main Map view
**When** I select a specific user
**Then** the map updates to show only markers for that user

*Note: This user story should also include options for viewing markers for all users, and only markers that the Administrator has created (i.e. Show my markers)*

**Team Notes**
- GET - API `/api/all/places`
- `Main Map View`
  - on-click event on pins
    - Display `Place I've Visited` form
    - GET - API `/api/places/{id}`
  - Filter Places by User
    - GET - API `/api/all/places/{filter}`
    - UI List
    
## User Story #8
As an administrator, I should be able to edit/delete markers for other users

**Given** that I'm an administrator
**And** I'm on the Main Map view
**When** I select a marker on the map (for either myself or another user)
**Then** I am given the option to edit the textual note or delete the marker (with confirmation) 

**Team Notes**
- GET - API `/api/all/places`
- `Main Map View`
  - on-click event on pins
    - Display `Place I've Visited` form
    - Edit/Delete ability
    - GET - API `/api/places/{id}`
    - PUT - API `/api/places/{id}`
    - DELETE - API `/api/places/{id}`
    - Confirmation dialog
    - Update map to remove pin
    
## User Story #9

As a regular user or an administrator, I should be able to sign out of the application

**Given** that I'm a regular user or an administrator
**And** I'm on the Main Map view
**When** I select Sign-out in the application header
**Then** I am signed out of the application and returned to the Landing/Sign-in page

**Team notes**
- `Main Map View`
  - Sign-out
  
## User Story #10

As a Product Owner, I would like to see the following documentation
- README.md, with steps on how to quickly begin using the application
- Build/Deploy steps
- APACHE License

## User Story #11

As a Product Owner, I would like to see the following: 
- Manual Test Cases
- Unit Testing
  - Test coverage for
    - API
    - Frontend
  
