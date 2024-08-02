"""
This script has functions used to connect to the parcel layer 
 (openmaps.gov.bc.ca) and helper functions to parse that data.

Imports for making http requests, converting strings to and from json,
  and shape and point processing.
"""
import http.client
import json
from shapely.geometry import Polygon, Point
import helpers
from time import sleep

# how much to buff the parcel boundary up 0.00025 is roughly 100 meters
COORD_BUFFER = 0.00025

def request_data_by_pid(in_pid):
    """
    Send request to parcel layer to get information on pid
    """
    payload = ''
    conn = http.client.HTTPSConnection("openmaps.gov.bc.ca")

    headers = {
        'Cookie': 'GS_FLOW_CONTROL=GS_CFLOW_-1d0f2b31:18fe922f235:-298b'
    }
    request_str = "/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?" + \
    "service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=" + \
    "application/json&typeNames=pub:WHSE_CADASTRE." + \
    "PMBC_PARCEL_FABRIC_POLY_SVW&srsName=EPSG:4326&cql_filter=" + \
    "PID_NUMBER="

    full_req_str = request_str + str(in_pid)

    conn.request("GET", full_req_str , payload, headers)
    res = conn.getresponse()
    data = res.read()

    return data

def request_data_by_point(in_point):
    """ Send request to parcel layer to get information on point"""
    payload = ''
    conn = http.client.HTTPSConnection("openmaps.gov.bc.ca")
    headers = {}
    request_str = "/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?" + \
    "service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=" + \
    "application/json&typeNames=pub:WHSE_CADASTRE." + \
    "PMBC_PARCEL_FABRIC_POLY_SVW&srsName=EPSG:4326&cql_filter=" + \
    "CONTAINS(SHAPE,SRID=4326;POINT"
    encoded_point = in_point.replace(" ", "%20")
    full_req_str = request_str + encoded_point + ")"

    conn.request("GET", full_req_str , payload, headers)

    res = conn.getresponse()
    data = res.read()
    return data.decode("utf-8")

def check_rows_point(rows):
    """ 
    goes through the rows in and checks each point against values from the
    parcel layer (openmaps.gov.bc.ca). If the pids dont align add the line to
    the bad list.
    """
    problem_rows = []
    col_names = rows[0]
    payload = ''
    conn = http.client.HTTPSConnection("openmaps.gov.bc.ca")

    headers = {
        'Cookie': 'GS_FLOW_CONTROL=GS_CFLOW_-1d0f2b31:18fe922f235:-298b'
    }
    request_str = "/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?" + \
    "service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=" + \
    "application/json&typeNames=pub:WHSE_CADASTRE." + \
    "PMBC_PARCEL_FABRIC_POLY_SVW&srsName=EPSG:4326&cql_filter=" + \
    "CONTAINS(SHAPE,SRID=4326;"
    index_point = col_names.index("Point")
    pid_index = col_names.index("PID")
    num_rows = len(rows)

    for count, row in enumerate(rows):

        helpers.print_percentage(count, num_rows)

        # skip header row
        if count == 0:
            temp_row = row
            temp_row.append("Problem")
            problem_rows.append(temp_row)
            continue

        temp_row = row
        point = row[index_point]
        pid = row[pid_index]

        if point is None or point == "" or pid is None or pid == "":
            temp_row.append("No point or pid for row")
            problem_rows.append(temp_row)
            continue

        encoded_point = point.replace(" ", "%20")
        full_req_str = request_str + encoded_point + ")"
        conn.request("GET", full_req_str , payload, headers)
        res = conn.getresponse()
        data = res.read()
        try:
            readable_data = json.loads(data.decode("utf-8"))
        except: # pylint: disable=bare-except
            temp_row.append("Issue reading Parcel Layer information")
            problem_rows.append(temp_row)
            continue

        if readable_data["numberMatched"] <= 0:
            temp_row.append("No result from Parcel Layer")
            problem_rows.append(temp_row)
            continue
        in_pid = readable_data["features"][0]["properties"]["PID"]
        if in_pid is None:
            temp_row.append("Parcel Layer returned none pid")
            problem_rows.append(temp_row)
            continue
        match_pid = helpers.remove_leading_zeros(in_pid)

        if match_pid != pid:
            err_str = "Pid mismatch got: " + match_pid
            temp_row.append(err_str)
            problem_rows.append( temp_row)
            continue
    print()
    return problem_rows

def check_rows_pid(rows):
    """ 
    goes through the rows in and checks their pid against returned shape from the
    parcel layer (openmaps.gov.bc.ca). If the pids dont align add the line to
    the bad list.
    """
    problem_rows = []
    col_names = rows[0]

    index_point = col_names.index("Point")
    pid_index = col_names.index("PID")
    num_rows = len(rows)

    for count, row in enumerate(rows):
        # skip the header row
        if count == 0:
            temp_row = row
            temp_row.append("Problem")
            problem_rows.append(temp_row)
            continue

        helpers.print_percentage(count, num_rows)

        temp_row = row
        in_point = helpers.get_point(row[index_point])
        pid = row[pid_index]

        if in_point is None:
            temp_row.append("Building has no POINT associated")
            problem_rows.append(temp_row)
            continue
        if pid is None:
            temp_row.append("Building has no PID associated")
            problem_rows.append(temp_row)
            continue

        try:
            readable_data = request_data_by_pid(pid)
            readable_data = json.loads(readable_data)

        except: # pylint: disable=bare-except
            temp_row.append("Issue with Parcel Layer information")
            problem_rows.append(temp_row)
            continue
        if readable_data["numberMatched"] <= 0:
            temp_row.append("No result from Parcel Layer")
            problem_rows.append(temp_row)
            continue

        point = Point(in_point)
        shapes = []
        polygon_type = readable_data["features"][0]["geometry"]["type"]
        coords = readable_data["features"][0]["geometry"]["coordinates"]

        if polygon_type == "Polygon":
            in_shape = coords[0]
            shapes.append(in_shape)
        elif polygon_type == "MultiPolygon":
            for shape in coords:
                in_shape = shape[0]
                shapes.append(in_shape)

        for count, ele in enumerate(shapes):
            parcel_polygon = Polygon(ele)
            parcel_polygon = parcel_polygon.buffer(COORD_BUFFER)

            if parcel_polygon.contains(point):
                continue
            if count >= len(shapes) -1:
                temp_row.append("Point not in parcel")
                problem_rows.append(temp_row)
                continue

    return problem_rows

def clean_municip(rows):
    """
    Goes through the list of data points and compares the returned municipality
    against the stored ministry. if there is a mismatch the row is added to
    the new bad list
    """
    headers = rows[0]
    pid_index = headers.index("PID")
    point_index = headers.index("Point")
    city_index = headers.index("City")
    tot_rows = len(rows)

    bad_rows = []

    for count, row in enumerate(rows):
        #skip header row
        if count == 0:
            temp_row = row
            temp_row.append("Problem")
            bad_rows.append(temp_row)
            continue

        helpers.print_percentage(count, tot_rows)

        temp_row = row
        pid = temp_row[pid_index]
        point = temp_row[point_index]
        city = temp_row[city_index]

        if pid == "" or point == "" or city == "":
            temp_row.append("Missing pid, point, or city")
            bad_rows.append(temp_row)
            continue

        try:
            data = request_data_by_pid(pid)
            data = json.loads(data)
        except: # pylint: disable=bare-except
            temp_row.append("issue requesting data from parcel layer")
            bad_rows.append(temp_row)
            continue

        if data["numberMatched"] <= 0:
            temp_row.append("no results from parcel layer")
            bad_rows.append(temp_row)
            continue

        in_municipality = data["features"][0]["properties"]["MUNICIPALITY"]

        if city not in in_municipality:
            temp_row.append("municipality mismatch got: " + in_municipality)
            bad_rows.append(temp_row)
            continue

    return bad_rows
