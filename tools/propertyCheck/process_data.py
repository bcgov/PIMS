"""
A file to define the process needed to veryify incoming data from PIMS.
"""
import json
import geocoder_connection
import parcel_layer_connection
import helpers

MAX_SET_BACK = 15

def address_city_set(add, city):
    """If either are blank we cant check with geocoder"""
    if add == "" or city == "":
        return False
    return True

def get_geocoder_point(pims_address, pims_city, set_back):
    """Send request to geocoder and return point"""
    result = geocoder_connection.call_geocoder(pims_address, pims_city, set_back)
    result_readable = json.loads(result)
    point = geocoder_connection.get_point_from_geo_data(result_readable)

    return point

def get_shapes(shapes, parcel_info):
    """parse information and add to shapes list"""
    polygon_type = parcel_info["features"][0]["geometry"]["type"]
    coords = parcel_info["features"][0]["geometry"]["coordinates"]

    if polygon_type == "Polygon":
        in_shape = coords[0]
        shapes.append(in_shape)
    elif polygon_type == "MultiPolygon":
        for shape in coords:
            in_shape = shape[0]
            shapes.append(in_shape)

def pims_point_in_pl(pims_point, pims_pid):
    """ Checks if the point in pims falls within the boundary of the parcel from parcel layer """
    pl_data = parcel_layer_connection.request_data_by_pid(pims_pid)
    try:
        parcel_layer_data_pid = json.loads(pl_data.decode("utf-8"))
    except: # pylint: disable=bare-except
        # error reading data from parcel layer
        return False

    if parcel_layer_data_pid["numberMatched"] <= 0:
        # no data from parcel layer
        return False

    shapes = []
    get_shapes(shapes, parcel_layer_data_pid)
    point_in_shape = helpers.is_point_in_shapes(pims_point, shapes)
    if point_in_shape[0]:
        return True

def hang_on_user_input():
    """
    Stop process and wait for user to enter y. If any other character is entered script exits.
    """
    user_input = input("Press 'y' to continue. Press anything else to exit.\n")
    if user_input.lower() != 'y':
        exit()

def process(data_in):
    """
    Go through elements. Try to clean them. 
    """
    manual_check_li = []
    final_li = []
    log_str = ''
    update_num = 1
    headers = data_in[0]
    total_rows = len(data_in)
    pims_address_index = headers.index("Address1")
    pims_city_index = headers.index("City")
    pims_point_index = headers.index("Point")
    pims_pid_index = headers.index("PID")

    for index, row in enumerate(data_in):
        # add header row to our new files
        if index == 0:
            final_li.append(row)
            temp_row = row
            temp_row.append("Problem")
            manual_check_li.append(temp_row)
            continue

        helpers.print_percentage(index, total_rows)
        pid_match = True
        point_in_parcel = True
        bad_address = True

        pims_address = row[pims_address_index]
        pims_city = row[pims_city_index]
        pims_point = row[pims_point_index]
        pims_point = helpers.get_point(pims_point)
        pims_pid = helpers.remove_leading_zeros(row[pims_pid_index])
        pl_pid = ""
        set_back = 0
        point = 0

        if not address_city_set(pims_address, pims_city):
            #if our database doesnt have an address or a city we have to check it manually
            row.append("Missing city or address cant validate")
            manual_check_li.append(row)
            continue

        if pims_point_in_pl(pims_point, pims_pid):
            # if the point we have stored in pims falls within the parcel we have valid data
            final_li.append(row)
            continue

        while set_back <= MAX_SET_BACK:
            point = get_geocoder_point(pims_address, pims_city, set_back)

            if point == 0:
                row.append("Geocoder could not return data on address.")
                manual_check_li.append(row)
                bad_address = True
                break

            point_str = "(" + str(point[0]) + " " + str(point[1]) + ")"
            parcel_layer_data_point = parcel_layer_connection.request_data_by_point(point_str)

            try:
                readable_data = json.loads(parcel_layer_data_point)
            except: # pylint: disable=bare-except
                # no data from parcel layer
                set_back = set_back + 5
                continue

            if readable_data["numberMatched"] <= 0:
                # no data from parcel layer
                set_back = set_back + 5
                continue

            pl_pid = readable_data["features"][0]["properties"]["PID"]

            if pl_pid is None:
                # no data from parcel layer
                set_back = set_back + 5
                continue

            # if we get to the end of the tests we have a good match.
            bad_address = False
            break

        if set_back > MAX_SET_BACK:
            row.append("Geocoder and parcel layer returned no data")
            manual_check_li.append(row)
            continue
        if bad_address:
            continue

        pl_pid = helpers.remove_leading_zeros(pl_pid)
        pl_data = parcel_layer_connection.request_data_by_pid(pl_pid)

        try:
            parcel_layer_data_pid = readable_data = json.loads(pl_data.decode("utf-8"))
        except: # pylint: disable=bare-except
            # error reading data from parcel layer
            row.append("Parcel layer data read error")
            manual_check_li.append(row)
            continue

        if parcel_layer_data_pid["numberMatched"] <= 0:
            # no data from parcel layer
            row.append("Parcel layer no match")
            manual_check_li.append(row)
            continue

        shapes = []
        get_shapes(shapes, parcel_layer_data_pid)

        if pims_pid != pl_pid:
            pid_match = False
        if pims_point is None or pims_point == 0:
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
            final_li.append(row)
            info = "  Updated POINT from " + str(pims_point) + " to " + new_point_str
            log_str = log_str + '\n' + str(update_num) + " " + str(row) + "\n" + info
            continue
        # if we have hit here both the pid and point dont match and we need to
        # go through the information manually.
        row.append("Both pid and point mismatch")
        manual_check_li.append(row)
        continue

    return (final_li, manual_check_li, log_str)
