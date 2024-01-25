""" No modules to import for this script. """
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
