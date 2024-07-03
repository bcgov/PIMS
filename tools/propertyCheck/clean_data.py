"""
A file to define the process needed to veryify incoming data from PIMS.
"""
import json
import geocoder_connection
import parcel_layer_connection
import helpers

MAX_SET_BACK = 15

def process(pims_data):
    """
    The process of checking pims data against itself to determine its validity
    """
    manual_check_li = []
    final_li = []
    log_str = ''
    update_num = 1
    headers = pims_data[0]
    total_rows = len(pims_data)
    pims_address_index = headers.index("Address1")
    pims_city_index = headers.index("City")
    pims_point_index = headers.index("Point")
    pims_pid_index = headers.index("PID")

    for index, row in enumerate(pims_data):
        # add header row to our new files
        if index == 0:
            final_li.append(row)
            row.append("Problem")
            manual_check_li.append(row)
            continue

        helpers.print_percentage(index, total_rows)

        pid_match = True
        point_in_parcel = True

        # get data point from csv
        pims_address = row[pims_address_index]
        pims_city = row[pims_city_index]
        pims_point = row[pims_point_index]
        pims_point = helpers.get_point(pims_point)
        pims_pid = helpers.remove_leading_zeros(row[pims_pid_index])

        # if we dont have this information we cant move forward
        if (pims_city == "" or pims_address == ""):
            #if our database doesnt have an address or a city we have to check it manually
            row.append("Missing city or address cant validate")
            manual_check_li.append(row)
            continue

        set_back = 0
        point = 0

        while point == 0 and set_back <= MAX_SET_BACK:
            # get information from geocoder
            result = geocoder_connection.call_geocoder(pims_address, pims_city, set_back)
            result_readable = json.loads(result)
            point = geocoder_connection.get_point_from_geo_data(result_readable)
            set_back = set_back + 5

        if set_back > MAX_SET_BACK:
            row.append("Geocoder returned no point")
            manual_check_li.append(row)
            continue

        point_str = "(" + str(point[0]) + " " + str(point[1]) + ")"
        # get parcel layer data
        parcel_layer_data_point = parcel_layer_connection.request_data_by_point(point_str)

        try:
            # try reading data from parcel layer
            readable_data = json.loads(parcel_layer_data_point)
        except: # pylint: disable=bare-except
            # no data from parcel layer
            row.append("Error reading result from parcel layer")
            manual_check_li.append(row)
            continue

        if readable_data["numberMatched"] <= 0:
            # no data from parcel layer
            row.append("0 result from parcel layer")
            manual_check_li.append(row)
            continue

        # pid from parcel layer
        pl_pid = readable_data["features"][0]["properties"]["PID"]

        if pl_pid is None:
            # no data from parcel layer
            row.append("Parcel layer no returned pid")
            manual_check_li.append(row)
            continue

        pl_pid = helpers.remove_leading_zeros(pl_pid)
        # get data from parcel layer
        parcel_layer_data_pid = parcel_layer_connection.request_data_by_pid(pl_pid)

        if parcel_layer_data_pid["numberMatched"] <= 0:
            # no data from parcel layer
            row.append("Parcel layer no match")
            manual_check_li.append(row)
            continue

        shapes = []
        # update shapes list to hold the shapes returned from parcel layer
        helpers.get_shapes(shapes, parcel_layer_data_pid)

        if pims_pid != pl_pid:
            pid_match = False
        if pims_point is None:
            point_in_parcel = False
        else:
            point_shape_data = helpers.is_point_in_shapes(pims_point, shapes)
            point_in_shape = point_shape_data[0]
            parcel_match_num = point_shape_data[1]
        if not point_in_shape:
            point_in_parcel = False

        if pid_match and point_in_parcel:
            # if both are good we have good data and can go to the next row
            final_li.append(row)
            continue
        if point_in_parcel:
            # if just the point is in the parcel we want to updat the pid
            row[pims_pid_index] = pl_pid
            final_li.append(row)
            info = "  Updated PID from " + pims_pid + " to " + pl_pid
            log_str = log_str + '\n' + str(update_num) + " " + str(row) + "\n" + info
            update_num = update_num + 1
            continue
        if pid_match:
            # if the pid is right we want to update the point to the center
            # of the matched parcel
            match_parcel = shapes[parcel_match_num]
            center_point = helpers.get_center(match_parcel)
            row[pims_point_index] = center_point
            new_point_str = str(center_point)
            info = "  Updated POINT from " + str(pims_point) + " to " + new_point_str
            log_str = log_str + '\n' + str(update_num) + " " + str(row) + "\n" + info
            continue
        # if we have hit here both the pid and point dont match and we need to
        # go through the information manually.
        row.append("Both pid and point mismatch")
        manual_check_li.append(row)
        continue
    return (final_li, manual_check_li, log_str)
