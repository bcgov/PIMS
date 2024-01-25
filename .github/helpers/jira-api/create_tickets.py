"""
Modules providing HTTP connections, json formatting, regex, operating system, and system operations
as well as: 
Modules used to connect to JIRA API, refining dependency updates and refining tickets.
"""
import http.client
import sys
import os
import json

import jira_con
import refine_dependency
import refine_tickets

###################################################################################################
##
## This script pulls in relevant JIRA tickets and dependency updates to create new tickets to cover
## weekly dependency updates.
##
## It uses the following scripts to do the heavy lifting of the group:
##     - jira_con.py: used for connection to JIRA.
##     - refine_dependency: used for refining strings and lists.
##     - refine_tickets.py: used for creating the tickets to post.
##     - errors.py (not used in this script) our own error class to
##         catch bad results from API calls.
##
###################################################################################################

def get_env_variables():
    """
    This method does the work for setting environment variables to be used in this script. We will
    also catch and report any errors as they arise. 

    Return:
      (
        level_flags,    # What levels of dependency updates to process.
        dep_in,         # List of Dependencies to be updated.
        jira_api_key,   # Authorization token for Jira.
        project_key,    # Project board to post to.
        jira_subtask,   # Subtask type for specific board.
        jira_epic       # Epic custom field id and parent ticket to link to.
      ): tuple containing the above information pulled in from environment variables. 
    """

    # check for dependency environment variable
    try:
        dep_in = os.environ["ISSUE_BODY"]
    except KeyError:
        sys.exit( "Unable to get ISSUE BODY" )

    # decode incoming string
    dep_in = refine_dependency.decode_github_env( dep_in )

    # check for jira api key environment variable
    try:
        jira_api_key = os.environ["JIRA_API_KEY"]
    except KeyError:
        sys.exit( "Unable to get JIRA API KEY" )

    # check for jira board environment variable
    try:
        project_key = os.environ["JIRA_BOARD"]
    except KeyError:
        sys.exit( "Unable to get Jira board" )

    # check for level flags
    try:
        level_flags = os.environ["LEVEL_FLAGS"]
    except KeyError:
        sys.exit( "Unable to get level flags" )

    # check for jira subtask type
    try:
        jira_subtask = os.environ["JIRA_SUBTASK"]
    except KeyError:
        sys.exit( "Unable to get Jira Subtask number. " )

    # check for epic id and key and seperate it into a tuple
    try:
        jira_epic = os.environ["JIRA_EPIC"]
        jira_epic = jira_epic.split(", ")
    except KeyError:
        sys.exit( "Unable to get Epic ID environment variable." )

    return ( level_flags, dep_in, jira_api_key, project_key, jira_subtask, jira_epic )

def refine_dep( level_flags, dep_in, summary_li ):
    """
    Used to parse the dependencies into the format we want.

    Args: 
      level_flags (string): env variable setting what updates we are going to parse.
      dep_in (string): env variable holding dependency list.
      summary_li (list[string]): list holding all ticket summaries we searched for.

    Returns: 
      updates (list): list containing reformated lists of updates in all folders.
    """
    updates = []
    dep_in = json.loads(dep_in, strict=False)

    # get the list of dependencies from GitHub for each folder
    for folder in dep_in:
        # refine the dependencies to look the way we want them to
        refined_li = refine_dependency.parse_dependencies( level_flags, dep_in[folder] )
        # remove any dependencies currently being worked on
        unique_li = refine_dependency.remove_duplicates(refined_li, summary_li, folder)
        updates.append((folder, unique_li))

    return updates

def create_tickets( conn, headers, updates, project_key, issue_key, epic_id ):
    """
    This function captures the work necessary for creating, finalization, and posting tickets. 

    Args: 
      conn (HTTPSConnection): specifies where to make the connection
      headers (string): specifies authentication to post to JIRA
      updates (tuple(list)): a tuple of lists holding the dependency updates
      project_key (string): a string representing the key for the board we want to post to
      issue_key (string): a string representing the id for the type of ticket we want to create
      epic_id: (id, key): a tuple containing epic id and ticket number we want to post under

    Returns:
      final_li (list): a list containing refined lists of json ticket data. One list for each folder 
    """
    final_li = []

    # create parent tickets and post them
    for folder in updates:

        if len(folder[1] ) == 0:
            # if there are no updates then there are no tickets to post.
            continue

        parent_ticket_json = refine_tickets.create_parent_ticket( project_key, folder, epic_id )
        parent_key = jira_con.post_parent_ticket( conn, headers, parent_ticket_json )
        # create sub tasks in Json format
        subtask_json = refine_tickets.create_subtasks( folder, parent_key, project_key, issue_key )
        for ele in subtask_json:
            final_li.append(ele)

    return final_li

def main():
    """ Works through the steps to refine dependency list and then create tickets in JIRA. """

    level_flags, dep_in, jira_api_key, project_key, issue_key, epic_id = get_env_variables()

    # establish https connection and necessary variables
    conn = http.client.HTTPSConnection( "citz-imb.atlassian.net" )
    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Basic " + jira_api_key
    }

    # get the list of summaries from JIRA
    summary_li = jira_con.get_summary_list( conn, headers, project_key )

    # refine dependencies
    updates = refine_dep( level_flags, dep_in, summary_li )

    # create all tickets
    json_lists = create_tickets( conn, headers, updates, project_key, issue_key, epic_id )

    # Post all tickets for each folder
    for ele in json_lists:
        jira_con.post_subtasks( conn, headers, ele )

if __name__=="__main__":
    main()
