# Code Challenge Notice, Instructions &amp; Rules

Re: [BC Developers' Exchange - Geo-spatial Real Estate Inventory System](https://bcdevexchange.org/opportunities/swu/opp-geospatial-real-estate-inventory-system) (the &quot;RFP&quot;)

Government Contact: Andrew.L.Sutherland@gov.bc.ca

This notice is dated Monday, December 16th, 2019 (the &quot;Notice Date&quot;).

Congratulations - you are a Shortlisted Proponent eligible to participate in the Code Challenge (Step 4 of the evaluation process described on the Evaluation tab of the RFP).

## Rules and Instructions

Please be advised of the following rules and instructions:

1. These code challenge rules and instructions apply only to Shortlisted Proponents and are part of the RFP.
2. Shortlisted Proponents will have no less than two (2) Business Days from the Notice Date to complete the code challenge. The **deadline** to complete the code challenge in accordance with these rules is **12:00 p.m. Pacific Time on Wednesday, December 18th, 2019** (the &quot;Deadline&quot;).
3. The Shortlisted Proponent&#39;s code challenge submission Deliverable (defined below) must be received by the Province (as provided for by these instructions) and be deposited and located in the applicable Repository before the Deadline, failing which such submission will not be eligible for evaluation and the associated Shortlisted Proponent Proposal will receive no further consideration and such Shortlisted Proponent will be eliminated from the RFP competition.
4. Only the Proponent Resources that were put forward in a Shortlisted Proponent&#39;s RFP Proposal are eligible to participate in the Code Challenge.
5. The Shortlisted Proponent Resources will be sent invites via GitHub to join this private repository.
6. As of the Notice Date, the code challenge issue has been created in this private repository, under the &quot;BCDevExchange-CodeChallenge&quot; organization.
7. Shortlisted Proponents may direct clarifying questions to Andrew.L.Sutherland@gov.bc.ca. Any such **questions** must be received by the Government Contact **before 12:00 p.m. Pacific time on Tuesday, December 17th, 2019** (the &quot;Code Challenge Questions Deadline&quot;).
8. The Province reserves the right to amend this notice before or after the Closing Time, including changing the Deadline or the Code Challenge Questions Deadline upon notice to all Shortlisted Proponents.
9. The Shortlisted Proponent must complete all of the following tasks and the Deliverable and as such they must be deposited and received in the applicable Repository by the Province in the form specified by this notice before the Deadline:
   1. Complete all code changes required to complete the code challenge (the &quot;Deliverable&quot;); and,
   2. Attach an Apache License 2.0 to the Deliverable.
10. The rules and instructions set forth in this notice are in addition to any rules, terms and conditions set forth elsewhere in the RFP.

# Deliverable

### Introduction
This code challenge asks you to build a simple GIS web application that allows users to select locations ("Places I've Visited") on a web map and persist them to a database.  The selected locations should be associated to that specific users' account in the system.  Each location will have a textual note associated with it.  Locations selected by a user should be viewable by the user that created them, and by users with the administrator role.  The user stories specified below will further outline the requirements.  You need to design and implement the front-end, REST API, and the database for this application.  You may use any open-source technologies of your choice.

## Technical Requirements

Solutions must be developed using technology and architectural patterns that demonstrates modern best practices and the ability to build GIS web applications. The solution should leverage open source components.

Solutions must be deployable to a Docker container platform.  Build and deployment configurations, along with **clear** instructions on how to build and deploy the solution, should be provided.  Ideally, the evaluators should be able build and deploy your solution locally with a few, well-documented, commands.

## User Stories
All of the following user stories must be completed. They may be completed in any order. 

**Assumptions**
- There are 3 personas for this application: anonymous, regular, and administrator
- Anonymous users should only have access to the landing/sign-in page
- Regular users should have access to a Main Map View but only see markers for their own locations
- Administrators should have access to a Main Map View and can see markers for all users
- The map view can be limited/constrained to a geographical area of your choice, but should be interactive

### #1
Sign in to the application as a regular user or administrator

**Given** that I'm an anonymous user  
**And** I’m in the Landing / Sign-in page  
**When** I click the Sign-in button  
**Then** I am prompted to enter my credentials (via some identity provider)
**And** I am taken to the Main Map View for the application
**And** In the application header, my username is displayed

*Note: It is up to you how to handle authentication - i.e. OAuth, Identity Provider, or email/password solutions are all acceptable.  User profile creation is not a requirement for this challenge, this is just a means of authenticating and identifying returning users*

### #2
As a regular user or administrator, I should be able to interact with the web map

**Given** that I'm a regular user or an administrator
**And** I am on the Main Map view      
**When** I click and drag on the map
**Then** The map is panned
**And When**  I use my mouse wheel
**Then** The map is zoomed

### #3
As a regular user or administrator, I should be able to add a "Place I've Visited" to the web map

**Given** that I'm a regular user or an administrator      
**And** I am on the Main Map view   
**When** I click on a location that does not already have a marker/pin  
**Then** a marker/pin is dropped on the location I clicked
**And** I am prompted to enter a textual note that is associated with that location
**And** When I save my note, the location and note are both persisted to the database

### #4
As a regular user, I should be able to view all of my "Places I've Visited" location markers on the web map

**Given** that I'm a regular user 
**And** I am on the Main Map view
**Then** I can see markers for all previous location markers that I have created    
**And** If I click on an individual marker
**Then** I can view the textual note associated with that marker

### #5
As a regular user, I should be able to edit the textual note associated with a location marker previously created

**Given** that I'm a regular user
**And** I am on the Main Map view
**When** I select a marker for one of my created locations
**Then** I am given the option to edit the textual note associated with that marker and persist my edits to the database     

### #6
As a regular user, I should be able to delete a previous created location marker that I have created

**Given** that I'm a regular user
**And** I am an on the Main Map view
**When** I select a marker for one my created location 
**Then** I am given the option to remove that marker from the map
**And** when I confirm that I want to remove the marker, it is deleted/archived in the database
**And** It is no longer visible on the Main Map view

### #7
As an administrator, I should be able view markers for all users and filter the visible markers by user

**Given** that I'm an administrator
**And** I am on the Main Map view
**When** I select a specific user
**Then** the map updates to show only markers for that user

*Note: This user story should also include options for viewing markers for all users, and only markers that the Administrator has created (i.e. Show my markers)*

### #8
As an administrator, I should be able to edit/delete markers for other users

**Given** that I'm an administrator
**And** I'm on the Main Map view
**When** I select a marker on the map (for either myself or another user)
**Then** I am given the option to edit the textual note or delete the marker (with confirmation) 

### #9

As a regular user or an administrator, I should be able to sign out of the application

**Given** that I'm a regular user or an administrator
**And** I'm on the Main Map view
**When** I select Sign-out in the application header
**Then** I am signed out of the application and returned to the Landing/Sign-in page


## Submission

1. Include all artifacts that are required to build and deploy the solution including code, Dockerfiles, other configuration files, etc.
2. Include all artifacts that would typically be included in the definition of done including demonstration of testing (full test suites are **not** required, but only a demonstration of how your team would test your solution).
3. Include a README file with instructions for building and deploying your solution.  If these instructions are omitted or unclear, points may be deducted.
4. Submit artifacts by way of a pull request to the private repository. All artifacts must be committed **before 12:00 p.m. Pacific time on Wednesday, December 18th, 2019**.
5. Attach an Apache License 2.0 to your pull request.

# Evaluation

| Criteria | Max Points |
| --- | --- |
| Meets requirements | 9 |
| Architecture and technical design | 4 |
| Code quality & maintainability | 4 |
| Build & Deployment Instructions | 1 |
|                                   |            |
|                                   |            |
|                                   |            |
| Total | 18 |
