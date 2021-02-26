import * as React from 'react';

/**
 * Help Text for the Property Inventory Filter topic.
 */
const InventoryFilterHelpText = () => {
  return (
    <p>
      The filter provides a way to search for properties with the specified attributes. The filter
      is cumulative ("AND"), which means each value will refine the results.
      <br />
      <strong>Agency:</strong> The agency that owns the property. This list is restricted to
      agencies and sub-agencies that you have access to view.
      <br />
      <strong>Property name:</strong> The name given to the property in PIMS.
      <br />
      <strong>Location:</strong> The administrative area (city, municipality, district, etc.)
      containing the value.
      <br />
      <strong>Address:</strong> The address contains the value.
      <br />
      <strong>PID/PIN:</strong> The property has the specified PID or PIN.
      <br />
      <strong>Classification:</strong> The property has the specified classification.
      <br />
    </p>
  );
};

export default InventoryFilterHelpText;
