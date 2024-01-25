""" 
Import Regex for some parsing.
"""
import re

###################################################################################################
##
## This script hosts functions that are used to decode env variables, remove matching elements from
## lists, and refine and parse the dependency list.
##
###################################################################################################

def decode_github_env( encoded_str ):
    """
    Used to decode the environment variable that is produced from 
     .github/helpers/check-npm-dependencies.js
    See workflow job: check-versions and create-issue for more information on the encoding. 

    Args:
      encoded_str (string): string holding specifically encoded environment variable.

    Returns:
      decoded_str (string): string holding decoded string value. 
    """

    decoded_str = encoded_str.replace( '%25', '%' )
    decoded_str = decoded_str.replace( '%0A', '\n' )
    decoded_str = decoded_str.replace( '%0D', '\r' )

    return decoded_str

def remove_duplicates( in_dep, in_sum, in_folder ):
    """
    Goes through the dependency lists, checks to see if the dependency listed 
    already has a ticket capturing the work. 
      - If yes we remove that dependency from the list and move to the next
      - If no we leave the dependency in the list and move to the next

    Args: 
      in_dep (list): a list containing dependency update information
      in_sum (list[string]): a list containing all ticket summaries for this folder
      in_folder (string): a string holding the name of the folder we are currently processing

    Returns: 
      new_li (list[string]): a list containing only elements that exist from
          in_dep that did not exist in in_sum
    """

    # holders for returned list and tickets to only hold dependency name
    new_li = []
    print("BEFORE")
    print("updates in folder: ", str(in_folder), "list: ")
    print(in_dep)
    print("Summary")
    print(in_sum)

    for ele in in_dep:
        #get the dependency name
        dep_name = ele['dependency']
        new_li.append(ele)

        # go through summary list
        for summary_tuple in in_sum:
            # pull out the summary and folder name
            summary = summary_tuple[0]
            folder_name = summary_tuple[1]
            if dep_name == summary and folder_name == in_folder:
                # if the dependency is in the summary and the folders are the
                # same remove the tuple from the list and go to the next tuple
                new_li.remove( ele )
                break

    print("AFTER")
    print(new_li)
    return new_li

def refine_updates( in_dep_str, refine_word ):
    """
    Used to parse through incoming dependency update text and pull out the
    two sections that are surrounded by the argument refine_word. The two
    sections are then concatanated and returned as a str. 

    Args:
      in_dep_str (string): string in from environment variable
      refine_word (string): given word that surrounds the section we are trying to extract

    Returns:
      refined (string): concatinated dependency updates of the defined refine_word sections
    """

    refined_str = ""
    refined_str_dev = ""

    # get the first section of refine_word
    start = re.search( refine_word, in_dep_str)
    end = re.search(refine_word + ".:", in_dep_str)
    # if either are none there is an error or the section doesnt exist
    if not (start is None or end is None):
        refined_str = in_dep_str[start.end(): end.start()]

    # get the dev section of refine_word
    start_dev = re.search( refine_word + "_dev", in_dep_str )
    end_dev = re.search( refine_word + "_dev.:", in_dep_str )
    # if either are none there is an error or the section doesnt exist
    if not (start_dev is None or end_dev is None):
        refined_str_dev = in_dep_str[start_dev.end(): end_dev.start()]

    # concatinate the two sections and return it
    refined = refined_str + refined_str_dev
    return refined

def refine_dependencies( string_in ):
    """
    This method takes in a string, reformats it into a list then goes through the list to 
    first add desired lines into a new list, then goes through that list to couple the update
    and update string into a tuple, which is added to a new list and returned. 

    Args:
      string_in (string): string value holding information on dependency updates

    Returns:
      new_li (list): a list of tuples with the following form ('dependency_update', 'update_string')
    """

    new_li = []
    temp_li = []
    # split incoming string into a list on the newline character
    li_in = string_in.splitlines()

    # go through list and if the line starts with "npm" or "- `" add it to a new list
    for line in li_in:
        check_str = line[:3]
        if check_str in ( "npm", "- `" ):
            temp_li.append(line)

    # for every line in the refined list create a tuple containing the line and the
    # line immediatly following.
    for index, line in enumerate(temp_li):
        if line[:3] == "- `":
            new_ele = ( line, temp_li[index + 1] )
            new_li.append( new_ele )

    return new_li


def parse_dependencies( level_flags, updates ):
    """
    Goes through level flags and if the specific level is requested we refine the updates. If the
    flag is not set it is left as an empty list.

    Args: 
      level_flags (string): env variable definind the levels of dependencies we want to check for
      updates (dictionary): dependency update dictionary for specific folder

    Returns: 
      dep_li (list): lists with dictionary elements of dependency updates
    """
    # split env variables into a list
    li_levels = level_flags.split()
    dep_li = []

    # take in the dependency string and parse it looking for flags we want to continue with
    for type_dep in updates:
        # seperates into dev dep and dep
        for level in updates[type_dep]:
            # level will let us know if it is minor major or patch update
            # check to see if it matches the levels we want to process
            if level.upper() in li_levels:
                for dependency in updates[type_dep][level]:
                    # add level and type to the dict
                    dependency['level'] = level
                    dependency['type'] = type_dep
                    # then add it to this list
                    dep_li.append(dependency)
    return dep_li
