"""
 Used to parse through the outdatedDeps.json file created in app-npm-dep-check.yml's
 parse-package-versions and curate a list that is easily parsable by Jira Automation task.

 Sample Input:
 { "folder1": { "deps": { "patch": [ { "dependency": <dependency name>,
                                     "version": <current version>,
                                     "latestVersion": <update to> },
                                     ... ],
                          "minor": [list of dependencies],
                          "major": [list of dependencies] },
                "devDeps": { ... } },
    ... ,
    "folderN": { "deps": { ... }, "devDeps": { ... } }
}

Sample Output:
{ "folder1": {
    "Total updates to process: <patchcount> + <minorcount> + <majorcount>

     There are <patchcount> patch updates.
     To update run the following:
     <string to update all patch deps>
     List of updates:
     <list of patch updates>

     There are <minorcount> minor updates.
     To update run the following:
     <string to update all minor deps>
     List of updates:
     <list of minor updates>

     There are <majorcount> major updates.
     To update run the following:
     <string to update all major deps>
     List of updates:
     <list of major updates>

     ERRORS:
     <list of errors>

     WARNINGS:
     <list of warnings>"
  ... ,
  "folderN": { ... } }

Imports:
"""
import os           # get environment variables and file output
import json         # transform incoming json string to python's dictionary format
import datetime     # get timestamp of errors/ warnings


# GLOBAL VARIABLES
# for level strings
S_PATCH = "patch"
S_MINOR = "minor"
S_MAJOR = "major"
# for devDeps & deps strings
DEPENDENCIES = "deps"
DEV_DEPENDENCIES = "devDeps"
# for indexing dependency lists
PATCH = 0
MINOR = 1
MAJOR = 2
# for exit codes. Set exit code to success at start.
EXIT_CODE = 0
SUCCESS = 0
ERROR = 1
WARNING = 2
# to capture errors and warnings hit
ERR_LI = []
WARN_LI = []
# list of levels to include in report
LEVELS = []
# if a variable name matches one in this list it will be left out of the normal list
IGNORE_LIST = []

def set_level_and_exit_code(code, message):
    """
    Takes in code and returns approperate log level. Updates EXIT_CODE as necessary.

    Args:
      code (number): Code of error. (see global vars for exit code meanings)
      message (str): Message of error. Will be added to approperate list.
    Returns:
      level (str):   Level of code to log.
    """
    # use global vars
    global ERR_LI    # pylint: disable=global-variable-not-assigned
    global WARN_LI   # pylint: disable=global-variable-not-assigned
    global EXIT_CODE # pylint: disable=global-statement

    # set log level based on code
    level = ""
    if code == SUCCESS:
        level = "SUCCESS"
    if code == ERROR:
        level = "ERR"
        ERR_LI.append(message)
        # if we hit any error we exit with error at the end
        EXIT_CODE = ERROR
    if code == WARNING:
        level = "WARN"
        WARN_LI.append(message)
        # if we already hit an error dont update exit code
        if EXIT_CODE != ERROR:
            # if no error has been hit set to warning
            EXIT_CODE = WARNING

    return level

def log(code, message):
    """
    Takes in code and message to print to console. Depending on code script may end with error.
    Log has following format: HH:MM:SS <A/P>M: <WARN/ERR/SUCCESS> message

    Args:
      code (number):    Code of error. (see global vars for exit code meanings)
      message (str):    String explaining the error
    """
    # get current time
    log_time = datetime.datetime.now()
    # get time into format: HH:MM:SS <A/P>M
    log_time = log_time.strftime("%I:%M:%S %p")

    # get log level and update EXIT_CODE
    log_level = set_level_and_exit_code(code, message)

    # log the log and a newline for ease of reading.
    print(log_time + ": " + log_level + "\n  " + message + "\n")

def get_env_variables():
    """
    This method does the work for setting environment variables to be used in this script. We will
    also catch and report any errors as they arise.

    Returns:
      return_env (dict): holds all env variables
        {
            dep_in (str): json string from parse-package-versions output with dependency information
        }
    """
    return_env = {}

    try:
        # if we can access the input set it
        dep_in = os.environ["DEP_INPUT"]
    except KeyError:
        log(ERROR, "Unable to get < DEP_INPUT >")
        exit(ERROR)

    # decode string based on Github standards
    decoded_str = dep_in.replace( '%25', '%' )
    decoded_str = decoded_str.replace( '%0A', '\n' )
    decoded_str = decoded_str.replace( '%0D', '\r' )
    # add to return object
    return_env['DEP_INPUT'] = decoded_str

    try:
        ignore_li = os.environ["ignoreList"]
    except KeyError:
        log(ERROR, "Unable to get < ignoreList >")
        exit(ERROR)
    # transform string of a list to a list and add to dict
    return_env['IGNORE_LIST'] = json.loads(ignore_li)

    try:
        dep_levels = os.environ["depLevels"]
    except KeyError:
        log(ERROR, "Unable to get < depLevels >")
        exit(ERROR)
    # transform string of a list to a list and add to dict
    return_env['DEP_LEVELS'] = json.loads(dep_levels)

    return return_env

def create_comment_string(dep_level, dep_cmd, dep_li):
    """
    Take in information and convert to string as shown above.

    Args:
      dep_level (str): <patch/minor/major>
      dep_cmd (str): command to run updates
      dep_li (list): list of updates in readable form

    Returns:
      return_str (str): string of comment for this dep_level
    """
    # if there is only one update use better language
    if len(dep_li) == 1:
        is_are = "is "
        update_s = " update.\n"
    else:
        is_are = "are "
        update_s = " updates.\n"

    count = "\n\nThere " + is_are + str(len(dep_li)) + " " + str(dep_level) + update_s
    update = "\nTo update run the following:\nnpm install " + dep_cmd + "\n"
    join_update_list = "\n".join(dep_li)
    list_u = "\nList of updates:\n" + join_update_list

    return_str = count + update + list_u
    return return_str

def dep_obj_to_str(folder_name, dep_li):
    """
    Take in a list of dependency update objects, pull out necessary information
     format into the string we want, and put into the return_li
       eg. 'Update <dependency> from <past ver> to <new_ver>'
     and a string of all dependencies in the following form:
       <dependency1>@<new_ver> <dependency2>@<new_ver> ... <dependencyN>@<new_ver>

    Args:
      folder_name (str): folder we are currently processing.
      dep_li (list): List of dependency objects in the following format:
            [ { "dependency1": <name>, "version": <old_ver>, "latestVersion": <new_ver> },
              ... , ]
    Returns:
      update_strs (tuple): holds both a list of update, and a string of short update commands.
        |-> ( <update_command>, <list of readable strings of deps to update> )
    """
    # every object in list should have these elements
    dep_ele = ['dependency', 'version', 'latestVersion']
    dependency = dep_ele.index('dependency')
    version = dep_ele.index('version')
    latest_version = dep_ele.index('latestVersion')
    # string for all updates
    all_update_cmds = ""
    update_li = []

    for dep_obj in dep_li:
        # check if any of the required elements are missing, if yes add to missing list
        missing_elements = []
        if dep_ele[dependency] not in dep_obj:
            missing_elements.append(dep_ele[dependency])
        if dep_ele[version] not in dep_obj:
            missing_elements.append(dep_ele[version])
        if dep_ele[latest_version] not in dep_obj:
            missing_elements.append(dep_ele[latest_version])
        # if there are are any elements missing log and continue
        if len(missing_elements) != 0:
            # if we are missing any of the titles above we have to log an go to the next list
            l_m = "From: < " + folder_name + " > missing [ " + str(missing_elements) +\
                " ] from this object: < " + str(dep_obj) + " >"
            log(WARNING, l_m)
            continue

        # get elements of dependency to update
        dep_name = dep_obj["dependency"]
        dep_past_ver = dep_obj["version"]
        dep_new_ver = dep_obj["latestVersion"]

        if dep_name in IGNORE_LIST:
            # if the dep name is in ignore list log, and go to next
            l_m = "Found update in: < " + folder_name + " > for: < " + dep_name + \
                " > which is on the ignore list. Dependency not included in final update list."
            log(WARNING, l_m)
            continue

        # add to string for all updates
        all_update_cmds += dep_name + "@" + dep_new_ver + " "

        # string for reporting, add to update li
        update_str = "Update " + dep_name + " from " + dep_past_ver + " to " + dep_new_ver
        update_li.append(update_str)

    # group str and list and return.
    update_strs = (all_update_cmds, update_li)
    return update_strs

def format_lists(folder, li_to_str, update_cmd_in,  update_li):
    """
    Takes in the list of dep objects extracts information with dep_obj_to_str then adds the
    information to the approperate areas.

    Args:
      folder (str):     folder we are currently processing
      li_to_str (li):   list of dep objects to update
      update_cmd (str): the string holding all update commands for this level
      update_li (li):   list of dependency updates in readable format
    Returns:
      update_cmd (str): updated string command
    """
    # get command string and list of patch depenencies
    d_cmd, d_li = dep_obj_to_str(folder, li_to_str)
    # add to approperate list
    update_li.extend(d_li)
    # update command to update
    update_cmd = update_cmd_in + d_cmd

    # strings arent mutable so return it
    return update_cmd

def create_update_dict(folder, outdated_json):
    """
    Add any dependencies to necessary lists and return as dictionary.

    Args:
      folder (str): folder we are currently processing
      outdated_dep_json (dict): jsonfied string from outdatedDeps.json
    Returns:
      return_li (list): grouping of lists of updates and str cmds
    """
    # checking if we have dev & regular dependencies
    missing_updates = []
    # add check to see if these exist
    patch_li = []
    patch_cmd = ""
    minor_li = []
    minor_cmd = ""
    major_li = []
    major_cmd = ""
    # loop through all dependencies present.
    to_process = []

    # if there are dependencies in the directory, add them
    if DEPENDENCIES not in outdated_json:
        missing_updates.append(DEPENDENCIES)
    else:
        # if DEPENDENCIES exist add to process
        dep_json = outdated_json[DEPENDENCIES]
        to_process.append(dep_json)

    # check if there are no DEV_DEPENDENCIES
    if DEV_DEPENDENCIES not in outdated_json:
        missing_updates.append(DEV_DEPENDENCIES)
    else:
        # if DEV_DEPENDENCIES exist add to process
        dev_json = outdated_json[DEV_DEPENDENCIES]
        to_process.append(dev_json)

    if DEPENDENCIES in missing_updates and DEV_DEPENDENCIES in missing_updates:
        # if there are no dependencies or dev dependencies there is an issue
        return WARNING

    for type_dep in to_process:
        # for each level we are reporting on add commands to string, and updates to list
        if S_PATCH in dev_json and S_PATCH in LEVELS:
            patch_cmd = format_lists(folder, type_dep[S_PATCH], patch_cmd, patch_li)
        if S_MINOR in dev_json and S_MINOR in LEVELS:
            minor_cmd = format_lists(folder, type_dep[S_MINOR], minor_cmd, minor_li)
        if S_MAJOR in dev_json and S_MAJOR in LEVELS:
            major_cmd = format_lists(folder, type_dep[S_MAJOR], major_cmd, major_li)

    # define return dictionary and set count
    return_li = []
    total_updates = len(patch_li) + len(minor_li) + len(major_li)
    if total_updates > 0:
        header_str = "There are a total of " + str(total_updates) + \
            " updates for PIMS/" + folder + "/\n"
    else:
        header_str = "Currently there are no updates for PIMS/" + folder + "/\n"

    return_li.append(header_str)

    if S_PATCH in LEVELS and len(patch_li) > 0:
        # if we are reporting on patch and there are updates include that section
        patch_str = create_comment_string(S_PATCH, patch_cmd, patch_li)
        return_li.append(patch_str)
    if S_MINOR in LEVELS and len(minor_li) > 0:
        # if we are reporting on minor and there are updates  include that section
        minor_str = create_comment_string(S_MINOR, minor_cmd, minor_li)
        return_li.append(minor_str)
    if S_MAJOR in LEVELS and len(major_li) > 0:
        # if we are reporting on major and there are updates  include that section
        major_str = create_comment_string(S_MAJOR, major_cmd, major_li)
        return_li.append(major_str)

    return return_li

def go_through_folders(json_input):
    """
    Go through all elements in input list and reformat into parsable json object with all
    information that is needed.
    """
    global ERR_LI  # pylint: disable=global-statement
    global WARN_LI # pylint: disable=global-statement
    update_dict = {}

    # loop through all folders
    for folder in json_input.keys():
        folder_values = json_input[folder]
        # call function to parse json and create lists
        cur_folder_updates = create_update_dict(folder, folder_values)
        # if we returned unsuccessfully log it and continue to next folder
        if cur_folder_updates == WARNING:
            log_msg = "Error parsing input, missing deps and devDeps element for < " + folder + " >"
            log(WARNING, log_msg)
            continue

        if len(ERR_LI) != 0:
            # if we hit any errors add the list to the output dict then clear the list
            error_report = "\nERRORS:\n" + "\n".join(ERR_LI)
            cur_folder_updates.append(error_report)
            ERR_LI = []
        if len(WARN_LI) != 0:
            # if we hit any warnings add the list to the output dict then clear the list
            warn_report = "\nWARNINGS:\n" + "\n".join(WARN_LI)
            cur_folder_updates.append(warn_report)
            WARN_LI = []

        # combine all elements of the list together, separate by newline.
        update_string = "\n".join(cur_folder_updates)
        # add string to return dict.
        update_dict[folder] = update_string

    return update_dict

def main():
    """
    Take in output from parse-package-versions. PArse information into better structure. Remove any
    dependencies in IGNORE_LIST and generate report updates in the levels specified in LEVELS.
    See doc above for sample input and output.
    """
    global IGNORE_LIST # pylint: disable=global-statement
    global LEVELS # pylint: disable=global-statement
    # get envronment variables
    env_vars = get_env_variables()

    # get the string to process, ignore list, and dependency levels to report on
    github_output_string = env_vars['DEP_INPUT']
    # set these to global vars to be used in multiple functions
    IGNORE_LIST = env_vars["IGNORE_LIST"]
    LEVELS = env_vars["DEP_LEVELS"]

    # convert input to json
    json_input = json.loads(github_output_string)

    # cumulate dictionary of updates through steps
    update_dict = go_through_folders(json_input)

    # set to string for output
    update_str = json.dumps(update_dict)

    log(SUCCESS, update_str)

    # get path to github output
    github_env = os.getenv('GITHUB_OUTPUT')
    # write retults to file
    with open(github_env, "a", encoding="utf-8") as env_file:
        env_file.write("commentContents=" + update_str)

    # log end
    log(EXIT_CODE, "Sript has completed")

# Main function wrapper with error catching.
if __name__ == "__main__":
    try:
        main()
    except Exception as error: # pylint: disable=broad-exception-caught
        # if we hit any unexpected errors, catch them, report, and exit.
        L_M = "Hit uncaught error while processing. Error message: " + str(error) + "\nQuitting."
        log(ERROR, L_M)
        exit(ERROR)
