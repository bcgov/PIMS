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
import csv
import datetime
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

def read_csv(in_file):
    """ 
    Ensures that incoming file exists and has necessary columns.
    reads and returns data.
    """
    rows = []

    # open file and process data
    with open(in_file, 'r', encoding='utf-8') as csv_in:
        csvreader = csv.reader(csv_in)
        # the first row is field names
        rows.append(next(csvreader))
        # if all fields are present we can read the rest of the data
        for row in csvreader:
            rows.append(row)
    # return column names and data
    return rows

def check_headers(headers, needed_list):
    """Ensures that every element in needed list is included in headers"""
    for i in needed_list:
        if i not in headers:
            exit_message = """
                  Please ensure all necessary columns are included in |
                  in_properties.csv: 
                  """ + needed_list
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
        ministry = row[index_of_name]
        if ministry not in REMOVE_LIST:
            new_li.append(row)

    return new_li

def write_csv_file(rows, file_name_start):
    """
    Takes in a header row and list of items to be written to csv out file
    """
    today = datetime.datetime.today().strftime('%d%m%Y')
    filename = file_name_start + "_out_" + str(today) + ".csv"

    with open(filename, 'w', encoding='utf-8') as csvout:
        csvwriter = csv.writer(csvout)
        csvwriter.writerows(rows)

    return filename

def process_data_flags(arg_li, rows):
    """ Process data based on flags that script was run with """
    headers = rows[0]
    tot_rows = len(rows)
    print("Processing ", tot_rows, " entries")

    if '-m' in arg_li:
        # Use the flag -m if you want to remove all items from the global
        # variable stored above named REMOVE_LIST
        rows = remove_elements(rows)
        print_num_removed(tot_rows - len(rows), "matched remove list.")
        tot_rows = len(rows)

    if '-p' in arg_li:
        # Use the flag -p if you want to go through PIDS and check that the
        # point stored falls within the returned polygon
        rows = parcel_layer_connection.check_rows_pid(rows)
        print_num_removed(tot_rows - len(rows), "points mismatched.")
        headers.append("Problem with PID data")
        tot_rows = len(rows)

    if '-l' in arg_li:
        # Use the flag -l if you want to send in a POINT to the parcel layer
        # and check that the returned PID matches the stored PID
        rows = parcel_layer_connection.check_rows_point(rows)
        print_num_removed(tot_rows - len(rows), "PIDs mismatched.")
        headers.append("Problem with Point data")
        tot_rows = len(rows)

    if '-c' in arg_li:
        # Iterate through the file and remove any entries that match the
        # expected ministry
        rows = parcel_layer_connection.clean_municip(rows)
        headers.append("Problem Municipality")

    return (headers, rows)

def main():
    """
    Used to control the flow of the script with given flags
    """
    #arg_li = sys.argv

    #if len(arg_li) <= 1:
    #    msg = "Please include at least one argument. See README for more info"
    #    exit_with_message(msg)

    # change current dir to the one we need
    os.chdir('./tools/propertyCheck/')

    in_file = "building.csv"

    rows = read_csv(in_file)

    good_li, bad_li, log_str = process_data.process(rows)
    # write good file
    write_csv_file(good_li, "good_building")
    write_csv_file(bad_li, "bad_building")
    helpers.write_txt_file(log_str, "log_building")

    #headers, bad_rows = process_data_flags(arg_li, rows)

    #file_out = write_csv_file(headers, bad_rows)

    #print("Wrote remaining lines to ", file_out

if __name__ == "__main__":
    main()
