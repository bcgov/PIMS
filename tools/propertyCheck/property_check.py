"""
This script will go through the given file(s) and process the data as requested
through the following flags. 
  -p send request to parcel layer on PID. Check that the stored point falls
     within the returned shape.
  -l send request to parcel layer on point. Check that the stored PID matches
     the stored PID.
  -a send request to geocoder on address. Check that the returned point against
     the stored point and get the distance between the two.
  -m remove any rows that match an element in REMOVE_LIST.
  -c remove entities that match the expected ministry from parcel layer
"""
import os
import sys
import importlib.util
import parcel_layer_connection
import process_data
import helpers

REMOVE_LIST = [
    'Vancouver Island University',
    'Okanagan College',
    'Camosun College',
    'University of BC',
    'University of Northern BC',
    'University of the Fraser Valley'
]

def exit_with_message(message):
    """ Exit program and print message to stout """
    print(message)
    sys.exit()

def print_num_removed(number, message):
    """ Prints message to stdout with number indicated"""
    print("removed ", number, " rows that ", message)
    print()

def check_headers(headers, needed_list):
    """Ensures that every element in needed list is included in headers"""
    for i in needed_list:
        if i not in headers:
            exit_message = "Please ensure all necessary columns: " \
                + str(needed_list) + " are included in given file."
            exit_with_message(exit_message)

def remove_elements(rows):
    """
    Takes in a file and removes all elements in said file that match any
    of the names in the list below returns the reduced list
    """

    headers = rows[0]
    index_of_name = headers.index("Ministry")
    new_li = []

    for count, row in enumerate(rows):
        if count == 0:
            new_li.append(row)
            continue
        ministry = row[index_of_name]
        if ministry not in REMOVE_LIST:
            new_li.append(row)

    return new_li

def get_file_name(arg_li, flag):
    """
    Take the argument list and flag we are currently working on and return
    the file name directly preceding the flag.
    """
    index_of_flag = arg_li.index(flag)
    index_of_file = index_of_flag + 1
    file_name = arg_li[index_of_file]
    return file_name

def check_packages(package_li):
    """
    Used to check if packages needed are installed correctly.
    If package isnt installed exit with method.
    """
    need_to_install_li = []
    for package_name in package_li:
        spec = importlib.util.find_spec(package_name)
        if spec is None:
            need_to_install_li.append(package_name)

    if len(need_to_install_li) > 0:
        exit_with_message("Must have the following packages to run: " + str(need_to_install_li))

def process_data_flags(arg_li):
    """ Process data based on flags that script was run with """

    if '-run' in arg_li:
        # Use this flag if you want to go through the process laid out in
        # process_data.py.
        file_name = get_file_name(arg_li, '-run')
        rows = helpers.read_csv(file_name)
        base_file_name = file_name[:-4]

        needed_packages = ["shapely"]
        check_packages(needed_packages)

        needed_headers = ["Address1", "City", "Point", "PID"]
        check_headers(rows[0], needed_headers)

        good_li, bad_li, log_str = process_data.process(rows)
        # write good file
        helpers.write_csv_file(good_li, "good_" + base_file_name)
        helpers.write_csv_file(bad_li, "bad_" + base_file_name)
        helpers.write_txt_file(log_str, "log_" + base_file_name)

    if '-m' in arg_li:
        # Use the flag -m if you want to remove all items from the global
        # variable stored above named REMOVE_LIST
        file_name = get_file_name(arg_li, '-m')
        base_file_name = file_name[:-4]
        rows = helpers.read_csv(file_name)

        needed_headers = ["Ministry"]
        check_headers(rows[0], needed_headers)

        rem_rows = remove_elements(rows)
        helpers.write_csv_file(rem_rows, "remaining_ministries" + base_file_name)

    if '-p' in arg_li:
        # Use the flag -p if you want to go through PIDS and check that the
        # point stored falls within the returned polygon
        file_name = get_file_name(arg_li, '-p')
        base_file_name = file_name[:-4]
        rows = helpers.read_csv(file_name)
        tot_rows = len(rows)

        needed_packages = ["shapely"]
        check_packages(needed_packages)

        needed_headers = ["Point", "PID"]
        check_headers(rows[0], needed_headers)

        rem_rows = parcel_layer_connection.check_rows_pid(rows)
        print_num_removed(tot_rows - len(rem_rows), "points matched.")
        helpers.write_csv_file(rem_rows, "point_mismatched_" + base_file_name)


    if '-l' in arg_li:
        # Use the flag -l if you want to send in a POINT to the parcel layer
        # and check that the returned PID matches the stored PID
        file_name = get_file_name(arg_li, '-l')
        base_file_name = file_name[:-4]
        rows = helpers.read_csv(file_name)
        tot_rows = len(rows)

        needed_packages = ["shapely"]
        check_packages(needed_packages)

        needed_headers = ["Point", "PID"]
        check_headers(rows[0], needed_headers)

        rem_rows = parcel_layer_connection.check_rows_point(rows)
        print_num_removed(tot_rows - len(rem_rows), "PIDs matched.")
        helpers.write_csv_file(rem_rows, "pid_mismatched_" + base_file_name)

    if '-c' in arg_li:
        # Iterate through the file and remove any entries that match the
        # expected ministry
        file_name = get_file_name(arg_li, '-c')
        base_file_name = file_name[:-4]
        rows = helpers.read_csv(file_name)

        needed_headers = ["Point", "PID", "City"]
        check_headers(rows[0], needed_headers)

        rem_rows = parcel_layer_connection.clean_municip(rows)
        helpers.write_csv_file(rem_rows, "remaining_cities_" + base_file_name)

def main():
    """
    Used to control the flow of the script with given flags
    """
    arg_li = sys.argv

    if len(arg_li) <= 1:
        msg = "Please include at least one argument. See README for more info"
        exit_with_message(msg)

    # if we arent in the correct directory change it to the one we need
    cur_dir = os.getcwd()
    if cur_dir[-13:] != 'propertyCheck':
        os.chdir('./tools/propertyCheck/')

    process_data_flags(arg_li)

if __name__ == "__main__":
    main()
