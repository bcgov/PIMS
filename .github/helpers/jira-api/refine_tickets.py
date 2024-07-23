""" Importing modules for parsing, and json formatting"""
import json
import datetime

# Global var to set number of tickets we can post in one request.
MAX_TICKETS = 50

###################################################################################################
##
## This script hosts functions that are used to reformat given strings, create specific format and
## post parent and subtask tickets.
##
###################################################################################################

def create_parent_ticket( project_key, updates, epic_id ):
    """
    POST API to create a parent ticket on the specified board

    Args:
      project_key (string): defines project key of JIRA board we want to post to
      updates (list): list of dependencies for this folder
      epic_id (id, key): tuple containing field id and issue number of epic we want to post under

    Returns:
      parent_key (string): captures json object holding parent ticket request.
    """

    # get current day and format as Mon DD, YYYY
    today = datetime.date.today()
    today = today.strftime("%b %d, %Y")

    folder = updates[0]
    update_list = updates[1]

    summary_str = str(folder) + " Dependency Updates " + str(today)
    optional_summary = ""

    if folder == "express-api": 
        optional_summary = "\n\nPlease check formatting of dependency for xlsx " + \
        "it should match the following:\n" + \
        "https://cdn.sheetjs.com/xlsx-<versionnum>/xlsx-<versionnum>.tgz\n" + \
        "See https://github.com/bcgov/PIMS/pull/2521#discussion_r1676221873 " + \
        "for more information."

    # format the description of the parent ticket
    description = "Currently we have " + \
        str(len(update_list)) + " updates to process\n" + \
        "To update please navigate to the folder " + folder + "\n"\
        "``` cd " + folder + "```\n\nand run command listed in ticket"

    # json object to create parent ticket
    parent_ticket = json.dumps({
        "fields": {
            "project": {
                "key": project_key
            },
            "summary": summary_str ,
            "description": description + optional_summary,
            "issuetype": {
                "name": "Task"
            },
            "priority": {
                "name": "Medium"
            },
            "customfield_" + epic_id[0]: epic_id[1],
            "labels": [
                "DependencyUpdates"
            ]
        }
    })
    return parent_ticket

def create_subtasks( update_list, parent_key, project_key, jira_subtask ):
    """
    For every element in update_list we create a ticket dictionary and add it to the list of
    elements. Then we create an overarching dictionary with one parent element. Then it is 
    converted to a Json object. This Json object is then added to a list of elements.

    Args: 
      update_list (tuple): a tuple containing folder and update information in a list
      parent_key (string): specifies what ticket to post under
      project_key (string): specifies what project to post tickets to
      jira_subtask (string): specifies the type of subtask for this board

    Returns: 
      json_update_list (list): list contining lists of json objects of tasks
        for specified dependency updates.
    """
    json_update_li = []
    folder_name = update_list[0]
    updates = update_list[1]
    dict_update_list = []

    # for each update
    for inner_li in updates:
        # set variables we may want to use
        priority_level = ""
        dependency_type = ""
        dep_name = inner_li['dependency']
        level = inner_li['level']
        old_version = inner_li['version']
        new_version = inner_li['latestVersion']
        dep_type = inner_li['type']

        # check for dev dependency flag
        if dep_type == "devDeps":
            dependency_type = " -D "

        # set priority level based on what type of dependency we are working through
        if level == "minor":
            priority_level = "Medium"
        elif level == "major":
            priority_level = "High"
        elif level == "patch":
            priority_level = "Low"

        # reformat the string to how we want the summary to look
        update_command = "npm install " + dependency_type + str(dep_name) + "@" + new_version
        ver_delta = " from version " + str(old_version) + " to " + str(new_version)
        summary_title = "Update " + str(dep_name) + ver_delta + " in " + str(folder_name)
        description = "To update please run the following command:\n\n' " + update_command + " '"

        # create the json format we need
        current = {
            "update": {},
            "fields": {
                "project": {
                    "key": project_key
                },
                "parent": {
                    "key": parent_key
                },
                "issuetype": {
                    "id": jira_subtask
                },
                "priority": {
                    "name": priority_level
                },
                "labels": [
                    "DependencyUpdates"
                ],
                "summary": summary_title,
                "description": description
            }
        }
        # add to list of updates
        dict_update_list.append( current )
        # if we hit the number of max tickets then we have to finalize this 
        # section and start the next
        if len(dict_update_list) == MAX_TICKETS:
            dict_issueupdate_list = { "issueUpdates": dict_update_list }
            final_json = json.dumps( dict_issueupdate_list )
            json_update_li.append(final_json)
            dict_update_list = []

    # update what we created to have one parent element in a dict.
    dict_issueupdate_list = { "issueUpdates": dict_update_list }
    # transform dict to json object
    final_json = json.dumps( dict_issueupdate_list )
    json_update_li.append(final_json)

    # return list of json objects
    return json_update_li
