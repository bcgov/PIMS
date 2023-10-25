# Jira API Helper Scripts

## create_tickets.py

### Overview

This script was created with the following goal in mind: automatically create tickets in JIRA accurately depicting the dependency updates we would like to work on in a sprint. 
As work progressed we refined the goal into the following steps (note that these are specific to PIMS desired outcomes for this work):
1. Gather list of dependency updates
    - This list should only include minor and major updates
    - This list should only include current update information 
2. Gather list of dependency update tickets from JIRA 
    - This list should contain only necessary information
3. Remove items that appear on both lists
4. Create tickets in PIMS backlog in JIRA

### Service Account

IDIR: PIMSJIRA

Email: pimsjira@gov.bc.ca

To not have this process dependent on a personal account we are using a service account to generate a JIRA API Key (more information below.) 
This account's password needs to be updated every 90 days. That can be done using the following process: 
1. Open browser of choice and navigate to pwchange.gov.bc.ca (or any other Gov website)
    - This will start the process needed to update the password.
    - Alternatively you can try to log into a workstation (Windows) to trigger the password update.
2. Take note of the new password and inform team members of the change. 
    - This may eventually involve updating the password in a password sharing service.

To keep up with password changes or other necessary communications to the service account it is reccomended that one team member add the email to their outlook. The email can also be accessed through summer.gov.bc.ca

### Jira API key 

More information on Jira API keys here: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/

Because we are using this key within a Python script (create_tickets.py and jira_con.py) and further with the HTTP Python library we need to store the Jira API as a token rather than plain text. There are a few different ways to do this. The method that has been used in this case is using Postman and the following steps:

1. Start a new connection in the Postman app.
2. If necessary change to a "Get" request
3. Enter "https://citz-imb.atlassian.net/rest/api/2/issuetype" as the URL
4. Under Authorization tab:
   1. Select "Basic Authorization".
   2. Enter the service account email as the username.
   3. Enter the API key as the password.
5. Press "Send" in the Postman App. 
   - You should see a JSON Body returned with Issue Types and 200 OK. If this is the case jump to step 6.
   - If you get any other response (401, 400, ect.) 
       - you may not have permissions set correctly to access Jira. In this case, contact the IMB SAAS team for a permission change. 
           - https://citz-imb.atlassian.net/servicedesk/customer/portal/4
       - or you may have set up the API token incorrectly. Try recreating the API key. 
6. Select the "</>" (Code) button to the right of the Postman app.
    1. Switch language to Python - http.client
    2. Copy the generated token from the headers variable:
    
    ```headers = { 'Authorization': 'Basic <token_here>', ... }```

    3. This token can then be saved as a Github secret (see more information below) using the variable name "JIRA_API_KEY".

The generated key was then stored in GitHub secrets so that it can be utilized as an environment variable.
More information on Github secrets and how to use them here: https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions

### Dependency In

This value is used as the source of dependencies that need to be updated. This is specific to the formatting found in the issues created in the PIMS repo. See: https://github.com/bcgov/PIMS/issues/1772 as an example. 

### Project Key

Signifies what board in JIRA to post to within the IMB space. 
Example: PIMS
### Level Flags

String that holds the key words of dependencies we would like to update. Any arrangement of the following will be accepted and read: 

- PATCH
- MINOR
- MAJOR

If something other than the above is entered it will not be processed. Each key word should be seperated by a space.


## Other scripts in this space

### jira_con.py

Used to connect to JIRA and to pull existing tickets

### refine_dependency.py

Used for refining strings and lists from existing tickets and dependency lists. 

### refine_tickets.py

Used for finalizing the ticket API format for the parent and sub task tickets. 

### errors.py

Used for creating our own error class for handlind undesired API responses. 
