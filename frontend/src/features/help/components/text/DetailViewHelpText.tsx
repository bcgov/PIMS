import * as React from 'react';

/**
 * Help Text for the Parcel Detail View topic.
 */
const DetailViewHelpText = () => {
  return (
    <p>
      The Property Detail View provides a way to add, view and edit property attributes. The left
      pane contains the parcel information. The right pane is a map to highlight the location of the
      parcel. There is a stepper across the top of the left pane to separate the different attribute
      types and walk you through the steps of adding a property. When entering an address a request
      will be made to Geocoder to find the civic address. If you select the address it will update
      the property with the latitude, longitude, city and PID if is able to. You can manually change
      the pin location of the parcel by clicking the map in the right pane. Changes are not saved to
      the inventory until you click the Submit button on the final step.
    </p>
  );
};

export default DetailViewHelpText;
