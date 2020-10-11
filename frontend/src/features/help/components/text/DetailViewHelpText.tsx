import * as React from 'react';

/**
 * Help Text for the Parcel Detail View topic.
 */
const DetailViewHelpText = () => {
  return (
    <p>
      The Property Detail View provides a way to add, view and edit property attributes. The top
      left pane contains the parcel information. The bottom left pane contains all the buildings on
      the parcel. The right pane is a map to highlight the location of the parcel. When entering an
      address a request will be made to Geocoder to find the civic address. If you select the
      address it will update the property with the latitude, longitude, city and PID if is able to.
      You can manually change the pin location of the parcel by clicking the map in the right pane.
      Changes are not saved to the inventory until you click the Submit button.
    </p>
  );
};

export default DetailViewHelpText;
