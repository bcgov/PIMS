""" Importing modules for parsing, and json formatting"""
import re
import sys
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

def break_update_down( update ):
    """
    Takes in a string with an update detailed and rearanges to the format we want
      "Update <dependency> from `<old version>` to `<new version>`
    
    Args:
      update (string): string holding current dependency update

    Returns:
      summary (string): reformated string holding current dependency update
    """

    # seperate dependency into 2 groups
    check_str = re.search( r"^- `(.*)` Update (from version `.*` to `.*`)", update )
    # reformat line
    summary = "Update " + check_str.group(1) + " " + check_str.group(2)
    return summary

def get_length(in_li):
    """
    Takes in a list or a list of lists and returns the total number of elements in in_li.

    Args: 
      in_li (list): either just a list or a list of lists containing dependency updates.

    Returns:
      len_in_li (int): the total number of all elements within the list brought in. 
        ex. if in_li = [1, 2, 3] we return 3. 
            if in_li = [[1], [2], 3] we return 3.
    """

    len_in_li = 0

    # test if list is empty, if yes return 0
    if in_li == []:
        len_in_li = 0
    # test to see if we have a list of lists
    elif isinstance(in_li[0], list):
        # count the number of elements of each sub list and save totals in a list
        ele_counter = [len(v) for v in in_li]
        # sum all totals
        len_in_li = sum( ele_counter )
    else:
        # if we have a regular list we can just return the length
        len_in_li = len( in_li )

    return len_in_li

def create_parent_ticket( project_key, updates, epic_id ):
    """
    POST API to create a parent ticket on the specified board

    Args:
      project_key (string): defines project key of JIRA board we want to post to
      updates (tuple(lists)): tuple of the three update lists
      epic_id (id, key): tuple containing field id and issue number of epic we want to post under

    Returns:
      parent_key (string): captures json object holding parent ticket request.
    """

    # get current day and format as Mon DD, YYYY
    today = datetime.date.today()
    today = today.strftime("%b %d, %Y")

    # make update lists readable
    patch = updates[0]
    minor = updates[1]
    major = updates[2]

    # set variables to hold length of each sub type
    len_patch = get_length(patch)
    len_minor = get_length(minor)
    len_major = get_length(major)

    # format the description of the parent ticket
    description = "Currently we have:\n" + \
        "- " + str(len_patch) + " Patch updates\n" + \
        "- " + str(len_minor) + " Minor updates\n" + \
        "- " + str(len_major) + " Major updates\n\n" + \
        "To update please navigate to the frontend\n```" + \
        " cd frontend\n\nand run command listed in ticket"

    # json object to create parent ticket
    parent_ticket = json.dumps({
        "fields": {
            "project": {
                "key": project_key
            },
            "summary": "Dependency Updates " + str(today),
            "description": description,
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

def create_subtasks( version, update_list, parent_key, project_key, jira_subtask ):
    """
    For every element in update_list we create a ticket dictionary and add it to the list of
    elements. Then we create an overarching dictionary with one parent element. Then it is 
    converted to a Json object. This Json object is then added to a list of elements.

    Args: 
      version (string): delegation between minor/major/patch update
      update_list (list[string], list[string]): list of tuples containing dependencies to update
          and update string
      parent_key (string): specifies what ticket to post under
      project_key (string): specifies what project to post tickets to
      jira_subtask (string): specifies the type of subtask for this board

    Returns: 
      final_li (list): list contining json objects of tasks for specified dependency updates.
    """

    final_li = []

    for inner_li in update_list:
        dict_update_list = []
        priority_level = ""

        # set priority level based on what type of dependency we are working through
        if version == "minor":
            priority_level = "Medium"
        elif version == "major":
            priority_level = "High"
        elif version == "patch":
            priority_level = "Low"

        for update in inner_li:
            # reformat the string to how we want the summary to look
            summary_title = break_update_down( update[0] )
            description = "To update please run the following command:\n\n' " + update[1] + " '"

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

        # update what we created to have one parent element in a dict.
        dict_issueupdate_list = { "issueUpdates": dict_update_list }
        # transform dict to json object
        final_json = json.dumps( dict_issueupdate_list )

        # add json object to list of json objects
        final_li.append( final_json )

    # return list of json objects
    return final_li

def split_list( in_li ):
    """
    Takes in a list and breaks it into smaller lists of MAX_TICKETS elements or less.

    Args:
      in_li (list): list in that contains elements

    Returns:
      out_li (list[list]): list containing all elements of in_li but split into smaller lists
        of 50 or less elements.
    """

    li_out = []
    step = MAX_TICKETS

    # go through each MAX_TICKETSth element of the list sent in
    #   (first pass through i = 0, second i = 50)
    for i in range(0, len( in_li ), step):
        # temp holder for the step we are on
        x = i
        # capture a group of 50 elements from the in list into a new list
        #   and append that to the returned list
        li_out.append( in_li[ x : x + step ] )

    return li_out

def check_num_tickets( updates ):
    """
    This method takes in the three lists (as one tuple), then partition that list until it is 
    less than MAX_TICKET element lists in one list.

    Args:
      updates (tuple): Holds the three dependency update lists. 

    Returns:
      update (list[list], list[list], list[list]):
        Holds the three dependency lists with the assurance that the number of dependencies in
        the innermost lists have less than MAX_TICKET elements. 
    """

    patch, minor, major = updates
    sum_dependencies = len( patch ) + len( minor ) + len( major )

    # Check if there are any tickets left after removing duplicates or if there are too many
    if sum_dependencies == 0:
        sys.exit( "No unique tickets to create" )

    # split patch updates and transform into list of lists
    patch = split_list(patch)
    minor = split_list(minor)
    major = split_list(major)

    update = (patch, minor, major)
    return update

def create_tickets( updates, project, parent, subtask ):
    """
    Creates json items to be sent as requests to create parent ticket and all sub tasks.

    Args:
      updates (tuple): tuple of three lists, each containing sub tasks to transform into tickets
      project_key (string): specifies wha project to post to
      parent_key (string): specifies what ticket to post sub tasks under
      subtask (string): specifies the issue type for board we are posting to

    Returns:
      json_tickets ([patch], [minor], [major]):
        A tuple containing lists of json elements holding dependency updates

    """

    # break the updates back into 3 seperate lists
    update_patch, update_minor, update_major = updates

    # create subtasks and capture json object containing them
    json_subtasks_patch = create_subtasks( "patch", update_patch, parent, project, subtask )
    json_subtasks_minor = create_subtasks( "minor", update_minor, parent, project, subtask )
    json_subtasks_major = create_subtasks( "major", update_major, parent, project, subtask )

    # create tuple containing all json items
    json_tickets = (json_subtasks_patch, json_subtasks_minor, json_subtasks_major)

    return json_tickets
