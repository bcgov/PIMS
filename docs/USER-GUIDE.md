# Overview

Geo-spatial Real Estate Inventory System is a web application that manages users’ location markers with textual notes. The system restricts access to the authorized users only. Users have different access rights and privileges based on their roles. Purpose of this User Guide is to provide assistance to users working within the Geo-spatial Real Estate Inventory System.

# Software Requirements

Chrome or Firefox browser is required to ensure all elements of the application display and function properly. The application is not supported in IE11 and Edge.

Once the application is deployed visit http://localhost:3000 in a Chrome browser.
Instructions for application deployment can be found in the [README.md](../README.md)

# Functionality

## Sign-in Page

The Sign-in page captures your login credentials and authenticates you. It is accessible for all users including anonymous, regular, and administrator. Click on the ‘Sign-in’ button to login as a regular user or an administrator. Login and password information can be found in the [README.md](../README.md)  

![Sign-in Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/2.jpg)

## Main Map View

When you are signed into the application as a regular user you are presented with the Main Map View and in the application header, the username is displayed. You can pan the map by clicking and dragging. You can use your mouse wheel to zoom in and out. 

![Map Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/1.jpg)

### Regular User

#### Add Markers

As a regular user, you can add a marker by clicking on a location on the map. You are prompted to enter a textual note associated with the location. When you click on the "Save" button, the location and note are both saved.

![Add Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/12.jpg)

#### View Markers

As a regular user, you can view all your markers created previously on the map. Clicking on an individual marker will prompt the textual note associated with the marker in edit mode. You can close the textual note by clicking on the "x" in the upper right corner of the window. 

![View Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/9.jpg)

#### Edit Markers

Clicking on an individual marker will prompt a textual note associated with the marker in edit mode. You can click on the "Save" button to save your edits or click on the "x" to close the window without saving.

![Edit Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/3.jpg)

#### Delete Markers

While the textual note window is open, you can delete the selected marker by clicking on the "Delete" button. A popup window will appear to confirm deletion. You have the option to process the deletion or cancel the deletion.  

![Delete Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/4.jpg)

#### Sign-out

You can click on the "Sign-out" button in the application header to sign out of the application and return to the Sign-in page.

![Sign out Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/11.jpg)

### Administrator User

In addition to all of the features described above for regular users, you have access to the following features when you sign in as an administrator. 

![Admin Page](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/5.jpg)

#### Filter by user

When you are signed in to the application as an administrator you are presented with the Main Map View showing your own markers. In the application header, click the "filter" button to view the dropdown list of all of the users. You may click the "filter" button again to close the dropdown list.

![Filter Dropdown](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/8.jpg)

As an administrator, you can select a user from the dropdown list to view the markers for the selected user. Your name in the header is replaced with the selected user's name to display which user's markers are currently on the map. You may edit or delete markers for other users by clicking on a marker on the map. 

![Filter Dropdown](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/6.jpg)

As an administrator, you can view the marker for all of the users. 

![Filter Dropdown](https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue/blob/master/Screenshots/7.jpg)

Note: As an administrator, you can only create a new marker when your own account is selected in the filter dropdown list. When you try to add a marker while another user is selected in the filter, a popup window will appear reminding you to select yourself in the filter dropdown list.


