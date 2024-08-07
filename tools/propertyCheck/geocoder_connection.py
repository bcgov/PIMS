""" Makes a call to the geo coder with the given address """
import http.client
import helpers

def format_address(address):
    """Takes in a string address and replaces all spaces with %20"""
    mod_address = address.replace(" ", '%20')
    return mod_address

def call_geocoder(street_address, city, set_back):
    """Makes a call to the geocoder and returns the result"""
    conn = http.client.HTTPSConnection("geocoder.api.gov.bc.ca")
    payload = ''
    headers = {}
    encoded_address = format_address(street_address + " " + city)
    req_str = "/addresses.json?addressString=" + encoded_address + \
        "BC&locationDescriptor=accessPoint&maxResults=1" + \
        "&setBack=" + str(set_back) + "%0A&provinceCode=BC"
    conn.request("GET", req_str , payload, headers)
    res = conn.getresponse()
    data = res.read()
    return data.decode("utf-8")

def process_data(in_props, good_data):
    """If given two files that you want to pull 'good' data into"""
    count = 0
    log_li = []
    prop_headers = in_props[0]
    prop_address_index = prop_headers.index("Address1")
    prop_city_index = prop_headers.index("City")
    prop_pid_index = prop_headers.index("PID")
    data_headers = good_data[0]
    data_address_index = data_headers.index("Address")
    data_city_index = data_headers.index("CITY")
    data_pid_index = data_headers.index("PID")

    for prop_index, prop_row in enumerate(in_props):
        if prop_index == 0:
            continue

        p_address = prop_row[prop_address_index].lower()
        p_city = prop_row[prop_city_index].lower()
        p_pid = prop_row[prop_pid_index]

        for data_index, data_row in enumerate(good_data):
            if data_index == 0:
                continue
            d_address = data_row[data_address_index].lower()
            d_city = data_row[data_city_index].lower()
            d_pid = data_row[data_pid_index].replace("-", "")
            d_pid = helpers.remove_leading_zeros(d_pid)

            if p_address == d_address:

                if p_city == d_city and p_pid == d_pid:
                    break
                key_word = ''
                key_p = ""
                key_d = ""
                if p_city != d_city:
                    key_word = 'city'
                    key_p = p_city
                    key_d = d_city
                elif p_pid != d_pid:
                    key_word = 'pid'
                    key_p = p_pid
                    key_d = d_pid
                p = str(count) + ". Address: " + p_address + " match. " + key_word + " mismatch"
                log_li.append(p)
                log_li.append("  PIMS stored " + key_word + " " + key_p)
                log_li.append("  Verified dataset " + key_word + " " + key_d)
                count = count + 1

    return log_li

def get_point_from_geo_data(geo_data):
    """Takes json object from geocoder and returns the point in (x, y) format"""

    precision_points = geo_data["features"][0]["properties"]["precisionPoints"]
    precision_point_int = int(precision_points)

    if precision_point_int < 95:
        return 0
    point = geo_data["features"][0]["geometry"]["coordinates"]

    x = point[0]
    y = point[1]

    return(x, y)
