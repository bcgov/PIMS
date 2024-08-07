"""
This script is used to help process data to the format needed
"""
import datetime
import csv
from shapely.geometry import Polygon, Point
from shapely import centroid

COORD_BUFFER = 0.00025

def print_percentage(cur_row, total_rows):
    """ Print updating percent complete for longer functions. """
    percentage = cur_row / total_rows * 100
    percent = round(percentage, 2)
    # ANSI sequesnce to clear line on terminal
    # \x1b = ESCAPE   [2K = clear terminal line
    print(end='\x1b[2K')
    print(f'processing: {percent}', end='%\r')

def remove_leading_zeros(in_num_string):
    """
    Removes all leading 0's from in string returns string with no leading 0s
    """
    for index, i in enumerate(in_num_string):
        if in_num_string[index] != '0':
            res = in_num_string[index::]
            return res
    return in_num_string

def read_csv(in_file):
    """ 
    Ensures that incoming file exists and has necessary columns.
    reads and returns data.
    """
    rows = []

    # open file and process data
    with open("./data/" + in_file, 'r', encoding='utf-8-sig') as csv_in:
        csvreader = csv.reader(csv_in)
        # the first row is field names
        rows.append(next(csvreader))
        # if all fields are present we can read the rest of the data
        for row in csvreader:
            rows.append(row)
    # return column names and data
    return rows

def write_txt_file(in_file, file_name_start):
    """ Write text file """
    today = datetime.datetime.today().strftime('%d%m%Y')
    file_name = "./data/" + file_name_start + "_out_" + today + ".txt"
    with open(file_name, "w", encoding='utf-8') as file:
        file.write(in_file)

def write_csv_file(rows, file_name_start):
    """
    Takes in a header row and list of items to be written to csv out file
    """
    today = datetime.datetime.today().strftime('%d%m%Y')
    filename = "./data/" + file_name_start + "_out_" + str(today) + ".csv"

    with open(filename, 'w', encoding='utf-8') as csvout:
        csvwriter = csv.writer(csvout)
        csvwriter.writerows(rows)

    return filename

def is_point_in_shapes(in_point, shapes):
    """
    Go through the list of shapes and see if the point falls within any of them
    if it does return true and the number of polygon it was in, 
    if it doesnt return false
    """
    point = Point(in_point)
    shape_number = -1
    for count, ele in enumerate(shapes):
        parcel_polygon = Polygon(ele)
        #add about 100 m to the parcel boundary
        parcel_polygon = parcel_polygon.buffer(COORD_BUFFER)

        if parcel_polygon.contains(point):
            shape_number = count
            break
        # if we are on the last shape and the point fits in none of them
        if count >= len(shapes) -1:
            return (False, count)
    # if we are out of the loop the point is in the parcel
    return (True, shape_number)

def get_center(cords):
    """ Takes in a set of coordinates and returns the center of the points """
    temp_poly = Polygon(cords)
    center = centroid(temp_poly)
    return center

def get_point(str_point):
    """
    Takes a string point of a form similar to 'POINT (x y) and transforms it
    into a list of the points: ex. [x, y]
    """
    try:
        # break the string into a list on the '('
        str_point = str_point.split("(")
        # if the list only has 0 or one element we cant continue
        if len(str_point) <= 1:
            return None
        # get the second element in the list (ex. ['POINT ', 'x y)'])
        str_point = str_point[1]

        # break the closing braket off
        str_point = str_point.split(")")
        # get the fist element of the list (ex. ['x y', ''])
        str_point = str_point[0]
        # change points to list of points
        points = str_point.split(" ")

        if points[0] is None:
            return None

        # change the string values into floats
        points[0] = float(points[0])
        points[1] = float(points[1])
    except: # pylint: disable=bare-except
        # if we hit an error parsing the point return None
        return None

    return points

def get_shapes(shape_list, data_in):
    """ Go through data in and pull out shapes """
    polygon_type = data_in["features"][0]["geometry"]["type"]
    coords = data_in["features"][0]["geometry"]["coordinates"]

    if polygon_type == "Polygon":
        # we have one shape
        in_shape = coords[0]
        shape_list.append(in_shape)
    elif polygon_type == "MultiPolygon":
        # we have 2+ shapes 
        for shape in coords:
            in_shape = shape[0]
            shape_list.append(in_shape)
